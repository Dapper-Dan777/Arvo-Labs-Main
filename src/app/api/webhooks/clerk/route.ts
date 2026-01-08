import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import {
  mapPlanToClerk,
  isValidClerkPlan,
  type AccountType,
  type ClerkBillingPlan,
} from "@/lib/clerk-plan-mapping";
import { supabaseAdmin } from "@/lib/supabase-server";

/**
 * Clerk Webhook Handler for Billing Events
 * 
 * Handles:
 * - subscription.created: When a user subscribes to a plan
 * - subscription.updated: When a subscription is updated
 * 
 * For Team Plans:
 * - Automatically creates Organization if not exists
 * - Sets Organization publicMetadata (plan, isTeam)
 * - Sets User publicMetadata (plan, isTeam, accountType)
 * 
 * Uses svix for webhook verification
 */
export async function POST(request: NextRequest) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 }
    );
  }

  // Get the webhook secret from environment variables
  // Clerk webhook secret format: whsec_...
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET or WEBHOOK_SECRET is not set");
    // Return 200 to prevent Clerk from retrying
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 200 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    // Return 200 to prevent Clerk from retrying
    return NextResponse.json({ error: "Verification failed" }, { status: 200 });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    // Handle subscription events
    // Note: Clerk Billing webhook events may vary in structure
    // Common events: subscription.created, subscription.updated, checkout.session.completed
    if (
      eventType === "subscription.created" || 
      eventType === "subscription.updated" ||
      eventType === "checkout.session.completed"
    ) {
      const subscription = evt.data || evt.data?.object || evt.object;
      
      // Clerk subscription events can have different structures
      // Try multiple possible field names
      const userId = 
        subscription?.user_id || 
        subscription?.userId || 
        subscription?.user?.id ||
        subscription?.object?.user_id ||
        evt.data?.user_id ||
        evt.data?.userId;
      
      const planId = 
        subscription?.plan_id || 
        subscription?.planId || 
        subscription?.plan?.id ||
        subscription?.object?.plan_id ||
        evt.data?.plan_id ||
        evt.data?.planId;
      
      const planName = 
        subscription?.plan_name || 
        subscription?.planName || 
        subscription?.plan?.name ||
        subscription?.object?.plan_name ||
        evt.data?.plan_name ||
        evt.data?.planName ||
        planId;

      if (!userId) {
        console.error("No user_id in subscription event");
        return NextResponse.json({ error: "No user_id" }, { status: 200 });
      }

      // Determine if this is a team plan
      const isTeamPlan =
        planName.includes("team") ||
        planName.includes("org") ||
        planName.startsWith("team_") ||
        planName === "free_org";

      // Map plan name to Clerk Billing plan
      let clerkPlan: ClerkBillingPlan;
      let uiPlan: string;
      let accountType: AccountType;

      if (isTeamPlan) {
        accountType = "team";
        // Extract UI plan name from Clerk plan name
        if (planName.startsWith("team_")) {
          uiPlan = planName.replace("team_", "");
        } else if (planName === "free_org") {
          uiPlan = "starter";
        } else {
          // Try to extract from plan name
          uiPlan = planName.replace(/team|org|_/gi, "").toLowerCase() || "starter";
        }
        clerkPlan = mapPlanToClerk(uiPlan, accountType);
      } else {
        accountType = "user";
        // Extract UI plan name
        if (planName === "free_user") {
          uiPlan = "starter";
        } else {
          uiPlan = planName.toLowerCase();
        }
        clerkPlan = mapPlanToClerk(uiPlan, accountType);
      }

      // Validate mapped plan
      if (!isValidClerkPlan(clerkPlan)) {
        console.error("Invalid Clerk plan after mapping:", clerkPlan);
        return NextResponse.json({ error: "Invalid plan" }, { status: 200 });
      }

      const client = await clerkClient();

      // For team plans, create organization if not exists
      if (isTeamPlan && accountType === "team") {
        try {
          // Check if user already has an organization
          const userOrgs = await client.users.getOrganizationMembershipList({
            userId: userId,
          });

          if (!userOrgs || !userOrgs.data || userOrgs.data.length === 0) {
            // Create organization
            const user = await client.users.getUser(userId);
            const orgName = `${user.firstName || user.emailAddresses[0]?.emailAddress || "Team"}'s Team`;

            const organization = await client.organizations.createOrganization({
              name: orgName,
              createdBy: userId,
              publicMetadata: {
                plan: clerkPlan,
                isTeam: true,
                accountType: "team",
                createdAt: new Date().toISOString(),
              },
            });

            console.log("Organization created via webhook:", organization.id);
          } else {
            // Check if any existing organization has the same plan
            let orgFound = false;
            for (const membership of userOrgs.data) {
              const orgMetadata = membership.organization.publicMetadata as {
                plan?: string;
                isTeam?: boolean;
                accountType?: string;
              };
              
              // If this organization has the same plan, update it
              if (orgMetadata?.plan === clerkPlan && orgMetadata?.isTeam === true) {
                await client.organizations.updateOrganization({
                  organizationId: membership.organization.id,
                  publicMetadata: {
                    plan: clerkPlan,
                    isTeam: true,
                    accountType: "team",
                    updatedAt: new Date().toISOString(),
                  },
                });

                console.log("Organization metadata updated via webhook:", membership.organization.id);
                orgFound = true;
                break;
              }
            }
            
            // If no organization with this plan exists, create a new one
            if (!orgFound) {
              const user = await client.users.getUser(userId);
              const orgName = `${user.firstName || user.emailAddresses[0]?.emailAddress || "Team"}'s Team`;

              const organization = await client.organizations.createOrganization({
                name: orgName,
                createdBy: userId,
                publicMetadata: {
                  plan: clerkPlan,
                  isTeam: true,
                  accountType: "team",
                  createdAt: new Date().toISOString(),
                },
              });

              console.log("New organization created via webhook for different plan:", organization.id);
            }
          }
        } catch (orgError: any) {
          console.error("Error handling organization in webhook:", orgError);
          // Continue anyway - we'll still update user metadata
        }
      }

      // Update user metadata
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: clerkPlan,
          isTeam: accountType === "team",
          accountType: accountType,
          subscriptionUpdatedAt: new Date().toISOString(),
        },
      });

      console.log(`User metadata updated via webhook: ${userId}, plan: ${clerkPlan}`);

      return NextResponse.json({
        success: true,
        message: "Subscription processed",
        userId,
        plan: clerkPlan,
        accountType,
      });
    }

    // Handle organization events
    if (eventType === "organization.created") {
      const org = evt.data;
      try {
        const { error } = await supabaseAdmin
          .from("organizations")
          .insert({
            clerk_org_id: org.id,
            name: org.name,
            subscription_tier: (org.publicMetadata?.plan as string) || null,
            subscription_status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error("Error creating organization in Supabase:", error);
        } else {
          console.log("Organization created in Supabase:", org.id);
        }
      } catch (error) {
        console.error("Error handling organization.created:", error);
      }
    }

    if (eventType === "organization.updated") {
      const org = evt.data;
      try {
        const { error } = await supabaseAdmin
          .from("organizations")
          .update({
            name: org.name,
            subscription_tier: (org.publicMetadata?.plan as string) || null,
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_org_id", org.id);

        if (error) {
          console.error("Error updating organization in Supabase:", error);
        } else {
          console.log("Organization updated in Supabase:", org.id);
        }
      } catch (error) {
        console.error("Error handling organization.updated:", error);
      }
    }

    if (eventType === "organization.deleted") {
      const org = evt.data;
      try {
        const { error } = await supabaseAdmin
          .from("organizations")
          .delete()
          .eq("clerk_org_id", org.id);

        if (error) {
          console.error("Error deleting organization in Supabase:", error);
        } else {
          console.log("Organization deleted from Supabase:", org.id);
        }
      } catch (error) {
        console.error("Error handling organization.deleted:", error);
      }
    }

    // Handle organization membership events
    if (eventType === "organizationMembership.created") {
      const membership = evt.data;
      try {
        // First, get organization_id from Supabase using clerk_org_id
        const { data: org } = await supabaseAdmin
          .from("organizations")
          .select("id")
          .eq("clerk_org_id", membership.organization.id)
          .single();

        // Get user_id from Supabase using clerk_id
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", membership.publicUserData.userId)
          .single();

        if (org && user) {
          const { error } = await supabaseAdmin
            .from("organization_memberships")
            .insert({
              organization_id: org.id,
              user_id: user.id,
              role: membership.role,
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error("Error creating membership in Supabase:", error);
          } else {
            console.log("Membership created in Supabase:", membership.id);
          }
        } else {
          console.warn("Organization or User not found in Supabase for membership:", membership.id);
        }
      } catch (error) {
        console.error("Error handling organizationMembership.created:", error);
      }
    }

    if (eventType === "organizationMembership.updated") {
      const membership = evt.data;
      try {
        // Get organization_id and user_id from Supabase
        const { data: org } = await supabaseAdmin
          .from("organizations")
          .select("id")
          .eq("clerk_org_id", membership.organization.id)
          .single();

        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", membership.publicUserData.userId)
          .single();

        if (org && user) {
          const { error } = await supabaseAdmin
            .from("organization_memberships")
            .update({
              role: membership.role,
            })
            .eq("organization_id", org.id)
            .eq("user_id", user.id);

          if (error) {
            console.error("Error updating membership in Supabase:", error);
          } else {
            console.log("Membership updated in Supabase:", membership.id);
          }
        }
      } catch (error) {
        console.error("Error handling organizationMembership.updated:", error);
      }
    }

    if (eventType === "organizationMembership.deleted") {
      const membership = evt.data;
      try {
        const { data: org } = await supabaseAdmin
          .from("organizations")
          .select("id")
          .eq("clerk_org_id", membership.organization.id)
          .single();

        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", membership.publicUserData.userId)
          .single();

        if (org && user) {
          const { error } = await supabaseAdmin
            .from("organization_memberships")
            .delete()
            .eq("organization_id", org.id)
            .eq("user_id", user.id);

          if (error) {
            console.error("Error deleting membership in Supabase:", error);
          } else {
            console.log("Membership deleted from Supabase:", membership.id);
          }
        }
      } catch (error) {
        console.error("Error handling organizationMembership.deleted:", error);
      }
    }

    // Handle subscription status events
    if (eventType === "subscription.active") {
      const subscription = evt.data;
      try {
        const userId = subscription.user_id || subscription.userId;
        if (userId) {
          const { error } = await supabaseAdmin
            .from("users")
            .update({
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("clerk_id", userId);

          if (error) {
            console.error("Error updating subscription status to active:", error);
          }
        }
      } catch (error) {
        console.error("Error handling subscription.active:", error);
      }
    }

    if (eventType === "subscription.pastDue") {
      const subscription = evt.data;
      try {
        const userId = subscription.user_id || subscription.userId;
        if (userId) {
          const { error } = await supabaseAdmin
            .from("users")
            .update({
              subscription_status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("clerk_id", userId);

          if (error) {
            console.error("Error updating subscription status to past_due:", error);
          }
        }
      } catch (error) {
        console.error("Error handling subscription.pastDue:", error);
      }
    }

    // Handle user events
    if (eventType === "user.created") {
      const user = evt.data;
      try {
        const { error } = await supabaseAdmin
          .from("users")
          .insert({
            clerk_id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || null,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
            subscription_tier: (user.publicMetadata?.plan as string) || "starter",
            subscription_status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error("Error creating user in Supabase:", error);
        } else {
          console.log("User created in Supabase:", user.id);
        }
      } catch (error) {
        console.error("Error handling user.created:", error);
      }
    }

    if (eventType === "user.updated") {
      const user = evt.data;
      try {
        const { error } = await supabaseAdmin
          .from("users")
          .update({
            email: user.emailAddresses?.[0]?.emailAddress || null,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
            subscription_tier: (user.publicMetadata?.plan as string) || null,
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_id", user.id);

        if (error) {
          console.error("Error updating user in Supabase:", error);
        } else {
          console.log("User updated in Supabase:", user.id);
        }
      } catch (error) {
        console.error("Error handling user.updated:", error);
      }
    }

    // Handle subscription.created and subscription.updated (also sync to Supabase)
    if (eventType === "subscription.created" || eventType === "subscription.updated") {
      const subscription = evt.data || evt.data?.object || evt.object;
      const userId = 
        subscription?.user_id || 
        subscription?.userId || 
        subscription?.user?.id ||
        evt.data?.user_id ||
        evt.data?.userId;

      if (userId) {
        try {
          // Update user subscription_tier in Supabase
          const planName = 
            subscription?.plan_name || 
            subscription?.planName || 
            subscription?.plan?.name ||
            evt.data?.plan_name ||
            evt.data?.planName;

          if (planName) {
            const { error } = await supabaseAdmin
              .from("users")
              .update({
                subscription_tier: planName,
                subscription_status: subscription?.status || "active",
                updated_at: new Date().toISOString(),
              })
              .eq("clerk_id", userId);

            if (error) {
              console.error("Error updating subscription in Supabase:", error);
            } else {
              console.log("Subscription synced to Supabase for user:", userId);
            }
          }
        } catch (error) {
          console.error("Error syncing subscription to Supabase:", error);
        }
      }
    }

    // Handle other events (just acknowledge)
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    // Return 200 to prevent Clerk from retrying
    return NextResponse.json(
      { error: "Error processing webhook", details: error.message },
      { status: 200 }
    );
  }
}


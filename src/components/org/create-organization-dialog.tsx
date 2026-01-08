"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTeamOrganization } from "@/hooks/useCreateTeamOrganization";
import { Loader2, Users } from "lucide-react";

interface CreateOrganizationDialogProps {
  plan: string; // UI plan name (e.g., "starter", "pro", "enterprise")
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (organizationId: string) => void;
}

/**
 * Dialog component for creating a team organization
 * 
 * Usage:
 * <CreateOrganizationDialog
 *   plan="pro"
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 * />
 */
export function CreateOrganizationDialog({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: CreateOrganizationDialogProps) {
  const { user } = useUser();
  const { createOrganization, isLoading } = useCreateTeamOrganization();
  const [organizationName, setOrganizationName] = useState("");
  const [nameError, setNameError] = useState<string>("");

  // Minimum length for organization name
  const MIN_NAME_LENGTH = 3;

  // Set default organization name when dialog opens
  useEffect(() => {
    if (isOpen && user && !organizationName) {
      const defaultName = `${user.firstName || user.emailAddresses[0]?.emailAddress || "Team"}'s Team`;
      setOrganizationName(defaultName);
    }
  }, [isOpen, user, organizationName]);

  // Validate organization name
  const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    
    if (trimmed.length === 0) {
      setNameError("Team-Name ist erforderlich");
      return false;
    }
    
    if (trimmed.length < MIN_NAME_LENGTH) {
      setNameError(`Team-Name muss mindestens ${MIN_NAME_LENGTH} Zeichen lang sein`);
      return false;
    }
    
    if (trimmed.length > 50) {
      setNameError("Team-Name darf maximal 50 Zeichen lang sein");
      return false;
    }
    
    setNameError("");
    return true;
  };

  // Handle name input change with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setOrganizationName(newName);
    
    // Only show error if user has started typing
    if (newName.length > 0) {
      validateName(newName);
    } else {
      setNameError("");
    }
  };

  const handleCreate = async () => {
    const trimmedName = organizationName.trim();
    
    // Validate name before creating
    if (!validateName(trimmedName)) {
      return;
    }

    await createOrganization({
      plan,
      organizationName: trimmedName,
      onSuccess: (organizationId) => {
        onSuccess?.(organizationId);
        // Reset form
        setOrganizationName("");
        setNameError("");
        onClose();
      },
      onError: () => {
        // Error is already handled by the hook (toast notification)
        // Keep dialog open so user can retry
      },
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setOrganizationName("");
      setNameError("");
      onClose();
    }
  };

  // Check if form is valid
  const isFormValid = organizationName.trim().length >= MIN_NAME_LENGTH && !nameError;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Team erstellen</DialogTitle>
              <DialogDescription>
                Erstelle ein Team, um Team-Features zu nutzen
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Team-Name</Label>
            <Input
              id="org-name"
              value={organizationName}
              onChange={handleNameChange}
              placeholder="z.B. Mein Unternehmen"
              disabled={isLoading}
              className={nameError ? "border-destructive" : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && isFormValid) {
                  handleCreate();
                }
              }}
            />
            {nameError ? (
              <p className="text-sm text-destructive">{nameError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Du wirst automatisch als Administrator des Teams hinzugefügt.
                {organizationName.trim().length > 0 && organizationName.trim().length < MIN_NAME_LENGTH && (
                  <span className="block mt-1">
                    Noch {MIN_NAME_LENGTH - organizationName.trim().length} Zeichen erforderlich.
                  </span>
                )}
              </p>
            )}
          </div>

          {plan && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Ausgewählter Plan:</span>{" "}
                <span className="capitalize">{plan}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird erstellt...
              </>
            ) : (
              <>
                Team erstellen
                <Users className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


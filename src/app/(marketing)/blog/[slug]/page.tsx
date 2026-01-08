"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutNext } from "@/components/layout/LayoutNext";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { Button } from "@/components/ui/button";
import { getBlogPost, BlogPost as BlogPostType } from "@/lib/blog-utils";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        router.push("/blog");
        return;
      }

      try {
        const postData = await getBlogPost(slug);
        if (postData) {
          setPost(postData);
        } else {
          router.push("/blog");
        }
      } catch (error) {
        console.error("Fehler beim Laden des Blog-Posts:", error);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug, router]);

  if (loading) {
    return (
      <LayoutNext>
        <div className="container mx-auto py-20">
          <div className="text-center">
            <p className="text-muted-foreground">{t.blog?.postLoading || "Blog-Post wird geladen..."}</p>
          </div>
        </div>
      </LayoutNext>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = post.date
    ? format(new Date(post.date), "d. MMMM yyyy", { locale: language === "de" ? de : enUS })
    : "";

  // Übersetze Post-Titel, Excerpt und Content
  const translatedPost = language === "en" && t.blog?.posts?.[post.slug as keyof typeof t.blog.posts]
    ? {
        title: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.title || post.title,
        excerpt: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.excerpt || post.excerpt,
        content: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.content || post.content,
      }
    : { title: post.title, excerpt: post.excerpt, content: post.content };

  return (
    <LayoutNext>
      <article className="py-20">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.blog?.backToBlog || "Zurück zum Blog"}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {translatedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{formattedDate}</time>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {post.tags.map((tag, index) => {
                    // Übersetze Tags basierend auf der Sprache
                    const translatedTag = language === "en" && t.blog?.tags?.[tag as keyof typeof t.blog.tags]
                      ? t.blog.tags[tag as keyof typeof t.blog.tags]
                      : tag;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-md bg-secondary text-muted-foreground"
                      >
                        {translatedTag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {translatedPost.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {translatedPost.excerpt}
              </p>
            )}
          </header>

          {/* Content */}
          <div className="mb-12">
            <BlogPostContent content={translatedPost.content} />
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border">
            <Button variant="opuxOutline" asChild>
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.blog?.backToBlog || "Zurück zum Blog"}
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </LayoutNext>
  );
}



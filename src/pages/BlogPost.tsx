import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { Button } from "@/components/ui/button";
import { getBlogPost, BlogPost as BlogPostType } from "@/lib/blog-utils";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        navigate("/blog");
        return;
      }

      try {
        const postData = await getBlogPost(slug);
        if (postData) {
          setPost(postData);
        } else {
          navigate("/blog");
        }
      } catch (error) {
        console.error("Fehler beim Laden des Blog-Posts:", error);
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="text-center">
            <p className="text-muted-foreground">{t.blog.postLoading}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = post.date
    ? format(new Date(post.date), "d. MMMM yyyy", { locale: language === "de" ? de : enUS })
    : "";

  // Übersetze Post-Titel und Excerpt
  const translatedPost = language === "en" && t.blog?.posts?.[post.slug as keyof typeof t.blog.posts]
    ? {
        title: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.title || post.title,
        excerpt: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.excerpt || post.excerpt,
      }
    : { title: post.title, excerpt: post.excerpt };

  return (
    <Layout>
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
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.blog.backToBlog}
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
            <BlogPostContent content={post.content} />
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border">
            <Button variant="opuxOutline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.blog.backToBlog}
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
}


import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { BlogPost } from "@/lib/blog-utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { t, language } = useLanguage();
  const formattedDate = post.date
    ? format(new Date(post.date), "d. MMMM yyyy", { locale: language === "de" ? de : enUS })
    : "";

  // Übersetze Tags basierend auf der Sprache
  const translateTag = (tag: string): string => {
    if (language === "en" && t.blog?.tags?.[tag as keyof typeof t.blog.tags]) {
      return t.blog.tags[tag as keyof typeof t.blog.tags];
    }
    return tag;
  };

  // Übersetze Post-Titel und Excerpt
  const translatedPost = language === "en" && t.blog?.posts?.[post.slug as keyof typeof t.blog.posts]
    ? {
        title: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.title || post.title,
        excerpt: t.blog.posts[post.slug as keyof typeof t.blog.posts]?.excerpt || post.excerpt,
      }
    : { title: post.title, excerpt: post.excerpt };

  return (
    <article className="group">
      <Link
        to={`/blog/${post.slug}`}
        className="block p-6 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-lg h-full flex flex-col"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {formattedDate && (
            <>
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{formattedDate}</time>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
          {translatedPost.title}
        </h2>

        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
          {translatedPost.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 border border-border text-muted-foreground"
              >
                <Tag className="w-3 h-3" />
                {translateTag(tag)}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}


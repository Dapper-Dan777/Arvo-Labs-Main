import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { BlogPost } from "@/lib/blog-utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.date
    ? format(new Date(post.date), "d. MMMM yyyy", { locale: de })
    : "";

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
          {post.title}
        </h2>

        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/50 border border-border text-muted-foreground"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}


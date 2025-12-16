import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
      prose-strong:text-foreground prose-strong:font-semibold
      prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:space-y-2
      prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:space-y-2
      prose-li:text-muted-foreground prose-li:leading-relaxed
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
      prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-secondary prose-pre:border prose-pre:border-border
      prose-hr:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}


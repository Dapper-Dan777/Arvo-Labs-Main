import { BlogPost } from "./blog-utils";

export function generateRSSFeed(posts: BlogPost[], baseUrl: string = "https://arvo-labs.de"): string {
  const rssItems = posts
    .slice(0, 20) // Nur die neuesten 20 Posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
      
      return `    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeXml(post.excerpt)}]]></description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = posts.length > 0 && posts[0].date 
    ? new Date(posts[0].date).toUTCString() 
    : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Arvo Labs Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Neuigkeiten, Tipps und Einblicke rund um KI-Automatisierung für Gründer und KMU</description>
    <language>de-DE</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}


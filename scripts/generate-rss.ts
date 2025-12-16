import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  const blogDir = join(process.cwd(), "content", "blog");
  const files = await readdir(blogDir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const posts: BlogPost[] = [];

  for (const file of mdFiles) {
    const filePath = join(blogDir, file);
    const content = await readFile(filePath, "utf-8");
    const { data } = matter(content);
    const slug = file.replace(".md", "");

    posts.push({
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRSSFeed(posts: BlogPost[], baseUrl: string = "https://arvo-labs.de"): string {
  const rssItems = posts
    .slice(0, 20)
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = post.date
        ? new Date(post.date).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeXml(post.excerpt)}]]></description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate =
    posts.length > 0 && posts[0].date
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

async function main() {
  try {
    const posts = await getAllBlogPosts();
    const baseUrl = process.env.VITE_BASE_URL || "https://arvo-labs.de";
    const rssContent = generateRSSFeed(posts, baseUrl);

    const outputPath = join(process.cwd(), "public", "rss.xml");
    await writeFile(outputPath, rssContent, "utf-8");

    console.log(`✅ RSS-Feed generiert: ${outputPath}`);
    console.log(`   ${posts.length} Artikel gefunden`);
  } catch (error) {
    console.error("Fehler beim Generieren des RSS-Feeds:", error);
    process.exit(1);
  }
}

main();


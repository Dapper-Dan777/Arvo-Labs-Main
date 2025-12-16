import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

async function generateBlogData() {
  // Prüfe beide mögliche Pfade
  const blogDir1 = join(process.cwd(), "src", "content", "blog");
  const blogDir2 = join(process.cwd(), "content", "blog");
  
  const { access } = await import("fs/promises");
  let blogDir: string;
  try {
    await access(blogDir1);
    blogDir = blogDir1;
  } catch {
    blogDir = blogDir2;
  }
  
  const files = await readdir(blogDir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const posts: BlogPost[] = [];

  for (const file of mdFiles) {
    const filePath = join(blogDir, file);
    const content = await readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(content);
    const slug = file.replace(".md", "");

    posts.push({
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      content: markdownContent,
    });
  }

  // Sortiere nach Datum (neueste zuerst)
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Generiere JSON-Datei
  const outputPath = join(process.cwd(), "public", "blog-posts.json");
  await writeFile(outputPath, JSON.stringify(sortedPosts, null, 2), "utf-8");

  console.log(`✅ Blog-Daten generiert: ${outputPath}`);
  console.log(`   ${sortedPosts.length} Artikel gefunden`);
}

generateBlogData().catch((error) => {
  console.error("Fehler beim Generieren der Blog-Daten:", error);
  process.exit(1);
});


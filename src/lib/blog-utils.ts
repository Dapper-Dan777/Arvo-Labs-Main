import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // In Vite müssen wir die Blog-Posts dynamisch importieren
  const modules = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
  
  const posts: BlogPost[] = [];
  
  for (const path in modules) {
    const content = modules[path] as string;
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    const { data, content: markdownContent } = matter(content);
    
    posts.push({
      slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      content: markdownContent,
    });
  }
  
  // Sortiere nach Datum (neueste zuerst)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Versuche verschiedene Pfad-Varianten
    const modules = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
    
    for (const path in modules) {
      const fileSlug = path.split('/').pop()?.replace('.md', '') || '';
      if (fileSlug === slug) {
        const content = modules[path] as string;
        const { data, content: markdownContent } = matter(content);
        
        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          content: markdownContent,
        };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}


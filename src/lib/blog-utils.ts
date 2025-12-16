export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // Lade Blog-Posts aus der generierten JSON-Datei
    const response = await fetch('/blog-posts.json');
    
    if (!response.ok) {
      console.error(`Fehler beim Laden von blog-posts.json: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const posts: BlogPost[] = await response.json();
    console.log(`✅ ${posts.length} Blog-Posts aus JSON geladen`);
    
    // Sortiere nach Datum (neueste zuerst) - sollte bereits sortiert sein, aber sicherheitshalber
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Fehler beim Laden der Blog-Posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllBlogPosts();
    const post = posts.find(p => p.slug === slug);
    return post || null;
  } catch (error) {
    console.error(`Fehler beim Laden von ${slug}:`, error);
    return null;
  }
}


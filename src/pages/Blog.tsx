import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogTagFilter } from "@/components/blog/BlogTagFilter";
import { RSSFeedButton } from "@/components/blog/RSSFeedButton";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts, BlogPost } from "@/lib/blog-utils";
import { ChevronRight } from "lucide-react";

const POSTS_PER_PAGE = 5;

export default function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllBlogPosts();
        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Blog-Posts:", error);
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Alle verfügbaren Tags sammeln
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Gefilterte Posts basierend auf Suche und Tags
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Suche filtern
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tags filtern
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedTags]);

  // Angezeigte Posts (mit Pagination)
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    setVisibleCount(POSTS_PER_PAGE); // Reset pagination when filtering
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const hasMore = visibleCount < filteredPosts.length;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.blog.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
              {t.blog.subtitle}
            </p>
            <div className="flex justify-center">
              <RSSFeedButton />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Blog-Posts werden geladen...</p>
            </div>
          ) : (
            <>
              {/* Search and Filter */}
              <div className="mb-8 space-y-4">
                <BlogSearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClear={handleClearSearch}
                />
                {allTags.length > 0 && (
                  <BlogTagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                  />
                )}
                {(searchQuery || selectedTags.length > 0) && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {filteredPosts.length} {filteredPosts.length === 1 ? "Artikel gefunden" : "Artikel gefunden"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                )}
              </div>

              {/* Posts Grid */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-secondary/30 rounded-2xl p-12 border border-border max-w-2xl mx-auto">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      Noch keine Blog-Artikel verfügbar.
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Blog-Artikel werden in Kürze veröffentlicht.
                    </p>
                    <p className="text-muted-foreground text-xs mt-4">
                      (Prüfe die Browser-Konsole für Debug-Informationen)
                    </p>
                  </div>
                </div>
              ) : displayedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-secondary/30 rounded-2xl p-12 border border-border max-w-2xl mx-auto">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      Keine Artikel gefunden.
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Versuche es mit anderen Suchbegriffen oder entferne die Filter.
                    </p>
                    <Button
                      variant="opuxOutline"
                      size="sm"
                      onClick={handleClearSearch}
                      className="mt-4"
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedPosts.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="text-center mt-12">
                      <Button
                        variant="opuxOutline"
                        size="lg"
                        onClick={handleLoadMore}
                      >
                        Weitere ansehen
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}



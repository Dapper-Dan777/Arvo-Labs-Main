import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function Blog() {
  const { t } = useLanguage();

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
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-secondary/30 rounded-2xl p-12 border border-border">
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t.blog.comingSoon}
              </p>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t.blog.subscribeText}
                </p>
                <Button variant="opux" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  {t.blog.subscribe}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


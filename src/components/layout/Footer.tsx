import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// HINWEIS: Footer-Links hier pflegen, falls neue Seiten hinzukommen
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const { t } = useLanguage();

  // Footer-Links entsprechend der vorhandenen Routen
  // TODO: Dokumentation-Route ersetzen, sobald Docs live sind
  const productLinks: FooterLink[] = [
    { label: t.footer.product.links.features, href: "/funktionen" },
    { label: t.footer.product.links.pricing, href: "/preise" },
    { label: t.footer.product.links.documentation, href: "#" },
  ];

  const companyLinks: FooterLink[] = [
    { label: t.footer.company.links.about, href: "/ueber-uns" },
    { label: t.footer.company.links.blog, href: "/blog" },
    { label: t.footer.company.links.useCases, href: "/use-cases" },
    { label: t.footer.company.links.contact, href: "/kontakt" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t.footer.legal.links.privacy, href: "/datenschutz" },
    { label: t.footer.legal.links.imprint, href: "/impressum" },
    { label: t.footer.legal.links.terms, href: "/agb" },
  ];

  const currentYear = new Date().getFullYear();
  const copyrightText = t.footer.copyright.replace("{year}", currentYear.toString());

  return (
    <footer className="bg-background border-t border-border relative z-10">
      <div className="container mx-auto py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Spalte 1 - Arvo Labs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t.footer.brand.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.brand.description}
            </p>
          </div>

          {/* Spalte 2 - Produkt */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t.footer.product.title}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 3 - Unternehmen */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t.footer.company.title}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 4 - Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t.footer.legal.title}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

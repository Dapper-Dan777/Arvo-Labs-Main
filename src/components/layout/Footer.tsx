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
  const productLinks: FooterLink[] = [
    { label: t.footer.product.links.features, href: "/funktionen" },
    { label: t.footer.product.links.pricing, href: "/preise" },
    { label: t.footer.product.links.documentation, href: "/dokumentation" },
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
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/arvo_labs?igsh=dnJkc3pyb2g4bHBl&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-foreground group-hover:text-white transition-colors"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-[#0077B5] transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-foreground group-hover:text-white transition-colors"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function SupportModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Verhindere Body-Scroll wenn Modal offen ist
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Support Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "flex items-center gap-2",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "p-3 md:px-5 md:py-3",
          "rounded-full",
          "shadow-lg hover:shadow-xl",
          "transition-all hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
        aria-label={t.support.modal.title}
      >
        {/* Chat Bubble SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="20"
          height="20"
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
        </svg>
        <span className="hidden md:inline font-medium">Support</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={cn(
              "bg-card rounded-lg shadow-2xl max-w-sm w-full p-5 relative",
              "border border-border",
              "animate-fadeIn"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* X-Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
              aria-label="Modal schließen"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold text-foreground mb-5 pr-8">
              {t.support.modal.title}
            </h2>

            {/* Kontakt-Infos */}
            <div className="space-y-2.5 mb-5">
              {/* Telefon */}
              <a
                href="tel:+49123456789"
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-secondary transition-colors group"
              >
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t.support.modal.phone}</p>
                  <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    +49 123 456 789
                  </p>
                </div>
              </a>

              {/* E-Mail */}
              <a
                href="mailto:support@arvolabs.de"
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-secondary transition-colors group"
              >
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t.support.modal.email}</p>
                  <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    support@arvolabs.de
                  </p>
                </div>
              </a>

              {/* Öffnungszeiten */}
              <div className="flex items-center gap-2.5 p-2.5">
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t.support.modal.hours}</p>
                  <p className="font-semibold text-foreground">
                    {t.support.modal.hoursValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-5"></div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-3">
                {t.support.modal.cta}
              </p>
              <Link
                to="/support"
                onClick={() => setIsOpen(false)}
                className="inline-block w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t.support.modal.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


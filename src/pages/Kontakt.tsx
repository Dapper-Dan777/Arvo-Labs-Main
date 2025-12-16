import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Kontakt() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast({
          title: t.contact.form.success.title,
          description: t.contact.form.success.message,
        });
        // Reset form
        setFormState({
          name: "",
          email: "",
          company: "",
          interest: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Fehler",
        description: "Das Formular konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
              {t.contact.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {t.contact.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                <div className="p-12 rounded-2xl bg-card border border-border text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    {t.contact.form.success.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t.contact.form.success.message}
                  </p>
                  <Button
                    variant="opuxOutline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormState({
                        name: "",
                        email: "",
                        company: "",
                        interest: "",
                        message: "",
                      });
                    }}
                  >
                    {t.contact.form.success.newMessage}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  name="contact"
                  className="space-y-6"
                >
                  {/* Hidden form-name field for Netlify */}
                  <input type="hidden" name="form-name" value="contact" />
                  
                  {/* Honeypot spam protection */}
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human:
                      <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact.form.name} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact.form.email} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                        placeholder="max@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact.form.company}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact.form.interest}
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={formState.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                      >
                        <option value="">...</option>
                        <option value="demo">{t.contact.form.interestOptions.demo}</option>
                        <option value="features">{t.contact.form.interestOptions.features}</option>
                        <option value="pricing">{t.contact.form.interestOptions.pricing}</option>
                        <option value="useCases">{t.contact.form.interestOptions.useCases}</option>
                        <option value="other">{t.contact.form.interestOptions.other}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact.form.message} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all resize-none"
                      placeholder="..."
                    />
                  </div>

                  <Button type="submit" variant="opux" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      t.contact.form.submitting
                    ) : (
                      <>
                        {t.contact.form.submit}
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-muted-foreground text-xs text-center">
                    {t.contact.form.privacy}
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t.contact.info.email}</h3>
                <a href="mailto:kontakt@arvo-labs.de" className="text-muted-foreground hover:text-foreground transition-colors">
                  kontakt@arvo-labs.de
                </a>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t.contact.info.location}</h3>
                <p className="text-muted-foreground">
                  {t.contact.info.locationValue}
                  <br />
                  <span className="text-sm">{t.contact.info.remote}</span>
                </p>
              </div>

              <div className="p-6 rounded-xl bg-secondary/50 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{t.contact.info.response}</h3>
                <p className="text-muted-foreground text-sm">{t.contact.info.responseText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

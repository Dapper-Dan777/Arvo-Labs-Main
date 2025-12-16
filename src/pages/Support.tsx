import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Support() {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    company: "",
    email: "",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = "Bitte wählen Sie eine Problem-Kategorie";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Bitte geben Sie Ihren Namen ein";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Bitte beschreiben Sie Ihr Problem";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Die Beschreibung muss mindestens 10 Zeichen lang sein";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // TODO: Backend-Integration
      console.log("Support Request:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          category: "",
          name: "",
          company: "",
          email: "",
          description: "",
        });
        setStatus("idle");
        setErrors({});
      }, 3000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-secondary/30 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Support-Anfrage
            </h1>
            <p className="text-muted-foreground mb-8">
              Wir helfen Ihnen gerne weiter. Beschreiben Sie Ihr Problem und wir
              melden uns schnellstmöglich bei Ihnen.
            </p>

            {/* Success Message */}
            {status === "success" && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Anfrage erfolgreich gesendet!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === "error" && Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Bitte korrigieren Sie die Fehler im Formular
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Problem-Kategorie */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Problem-Kategorie <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger
                    id="category"
                    className={cn(
                      errors.category && "border-red-500 focus:border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Bitte wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technisches Problem</SelectItem>
                    <SelectItem value="billing">Abrechnungsfrage</SelectItem>
                    <SelectItem value="feature">Feature-Anfrage</SelectItem>
                    <SelectItem value="account">Account-Verwaltung</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Max Mustermann"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(errors.name && "border-red-500 focus:border-red-500")}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Firmenname */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Firmenname (optional)
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Ihre Firma GmbH"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              {/* E-Mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-Mail-Adresse <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(errors.email && "border-red-500 focus:border-red-500")}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Problem-Beschreibung */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Problem-Beschreibung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Bitte beschreiben Sie Ihr Problem so detailliert wie möglich..."
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className={cn(
                    errors.description && "border-red-500 focus:border-red-500"
                  )}
                  required
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {formData.description.length} Zeichen
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="opux"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  "Support-Anfrage senden"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}


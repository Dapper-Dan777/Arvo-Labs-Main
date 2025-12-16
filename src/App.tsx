import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Funktionen from "./pages/Funktionen.tsx";
import Preise from "./pages/Preise.tsx";
import UseCases from "./pages/UseCases.tsx";
import Kontakt from "./pages/Kontakt.tsx";
import UeberUns from "./pages/UeberUns.tsx";
import Blog from "./pages/Blog.tsx";
import Datenschutz from "./pages/Datenschutz.tsx";
import Impressum from "./pages/Impressum.tsx";
import AGB from "./pages/AGB.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/funktionen" element={<Funktionen />} />
              <Route path="/preise" element={<Preise />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/ueber-uns" element={<UeberUns />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

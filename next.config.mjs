import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Erzwinge korrektes Projekt-Root für Turbopack (verhindert falsches Lockfile-Root)
  turbopack: {
    root: __dirname,
  },
  // Performance-Optimierungen
  compress: true, // Gzip-Kompression aktivieren
  poweredByHeader: false, // X-Powered-By Header entfernen
  // Optimiere Bundle-Größe
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
  },
  // Ignoriere Dashboard - Arvo Verzeichnis (Vite-Projekt, nicht Teil von Next.js)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Path aliases are handled by tsconfig.json
};

export default nextConfig;


import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Initialisiere Theme basierend auf localStorage oder System-Präferenz
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Setze Theme basierend auf gespeicherter Präferenz oder System-Präferenz
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Setze Hintergrundfarbe basierend auf Theme (KI Startup Design)
  rootElement.style.backgroundColor = theme === 'dark' ? '#0f1117' : '#FFFFFF';
}

// Sicherstellen, dass der Root-Container sichtbar ist
rootElement.style.minHeight = "100vh";

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Error rendering app:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; background: white; color: black; min-height: 100vh;">
      <h1>Fehler beim Laden der App</h1>
      <p style="color: red;">${error instanceof Error ? error.message : "Unbekannter Fehler"}</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; max-width: 100%; word-wrap: break-word;">
${error instanceof Error ? error.stack : String(error)}
      </pre>
      <p>Bitte überprüfen Sie die Browser-Konsole für weitere Details.</p>
    </div>
  `;
}

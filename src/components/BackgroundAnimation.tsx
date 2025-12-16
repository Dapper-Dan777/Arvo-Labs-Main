import React, { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Draw grid after resize
      drawGrid();
    };

    // Grid configuration - Theme-basiert
    const gridSize = 50; // Size of each grid cell
    const lineWidth = 1;
    
    // Dark Mode: Schwarz-weiß Grid
    // Light Mode: Weiß-schwarz Grid
    const isDark = theme === "dark";
    const primaryColor = isDark 
      ? "rgba(255, 255, 255, 0.1)" // Weiße Linien auf schwarzem Hintergrund
      : "rgba(0, 0, 0, 0.1)"; // Schwarze Linien auf weißem Hintergrund
    const secondaryColor = isDark
      ? "rgba(255, 255, 255, 0.2)" // Hellere weiße Akzent-Linien
      : "rgba(0, 0, 0, 0.2)"; // Dunklere schwarze Akzent-Linien
    const backgroundColor = isDark
      ? "rgba(0, 0, 0, 1)" // Schwarzer Hintergrund
      : "rgba(255, 255, 255, 1)"; // Weißer Hintergrund

    // Draw grid function
    const drawGrid = () => {
      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = lineWidth;

      // Vertical lines (static)
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines (static)
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw accent lines (every 3rd line)
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = lineWidth * 1.5;

      // Vertical accent lines (static)
      for (let x = 0; x < canvas.width; x += gridSize * 3) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal accent lines (static)
      for (let y = 0; y < canvas.height; y += gridSize * 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Initial draw
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ backgroundColor: "transparent" }}
    />
  );
}


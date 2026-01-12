"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Save, Trash2, Download, Upload, Type, Square, Circle, PenTool, Image, Undo, Redo, X, Eraser, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface ColorUsage {
  color: string;
  count: number;
}

export default function TeamWhiteboardsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<"pen" | "text" | "rectangle" | "circle" | "image" | "eraser">("pen");
  const [color, setColor] = useState("#6366f1");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [customColors, setCustomColors] = useState<string[]>(["#6366f1", "#ef4444", "#3b82f6", "#4a4a4a"]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [tempColor, setTempColor] = useState("#6366f1");
  const [colorUsage, setColorUsage] = useState<ColorUsage[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [textInput, setTextInput] = useState<{ x: number; y: number; text: string } | null>(null);
  const [tempText, setTempText] = useState("");
  const [textInputPosition, setTextInputPosition] = useState<{ left: number; top: number } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Shift-Taste Tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Initialisiere Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = Math.max(rect.width / zoom, 1920);
        canvas.height = Math.max(rect.height / zoom, 1080);
        
        if (history.length === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    resizeCanvas();
    
    setTimeout(() => {
      const ctx = canvas.getContext("2d");
      if (ctx && canvas.width > 0 && canvas.height > 0 && history.length === 0) {
        const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialImageData]);
        setHistoryStep(0);
      }
    }, 100);

    window.addEventListener("resize", resizeCanvas);

    const savedColorUsage = localStorage.getItem("whiteboard-color-usage");
    if (savedColorUsage) {
      setColorUsage(JSON.parse(savedColorUsage));
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [zoom]);

  // Speichere Canvas-Zustand in History
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyStep + 1);
      newHistory.push(imageData);
      const newStep = newHistory.length - 1;
      setHistoryStep(newStep);
      return newHistory;
    });
  }, [historyStep]);

  // Zeichne auf Canvas
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing || !startPos) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x, y, (strokeWidth * 2) / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      setStartPos({ x, y });
    } else if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      if (isShiftPressed && startPos) {
        if (history.length > 0 && historyStep >= 0 && history[historyStep]) {
          ctx.putImageData(history[historyStep], 0, 0);
        }
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        setStartPos({ x, y });
      }
    }
  }, [isDrawing, tool, color, strokeWidth, startPos, isShiftPressed, history, historyStep, zoom]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (tool === "text") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement?.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      
      const left = (x * zoom) + (canvasRect.left - containerRect.left);
      const top = (y * zoom) + (canvasRect.top - containerRect.top);
      
      setTextInput({ x, y, text: "" });
      setTextInputPosition({ left, top });
      setTempText("");
      
      setTimeout(() => {
        textInputRef.current?.focus();
        textInputRef.current?.select();
      }, 100);
    } else if (tool === "pen") {
      if (isDrawing) {
        setIsDrawing(false);
      }
      saveToHistory();
      setStartPos({ x, y });
      setIsDrawing(true);
    } else if (tool === "eraser") {
      if (isDrawing) {
        setIsDrawing(false);
      }
      saveToHistory();
      setStartPos({ x, y });
      setIsDrawing(true);
    } else if (tool === "rectangle" || tool === "circle") {
      setStartPos({ x, y });
      setIsDrawing(true);
      saveToHistory();
    } else if (tool === "image") {
      document.getElementById("image-upload")?.click();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "pen" || tool === "eraser") {
      draw(e);
    } else if ((tool === "rectangle" || tool === "circle") && startPos && isDrawing) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let currentX = (e.clientX - rect.left) / zoom;
      let currentY = (e.clientY - rect.top) / zoom;

      if (history.length > 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = color;
      ctx.globalCompositeOperation = "source-over";

      if (tool === "rectangle") {
        let width = currentX - startPos.x;
        let height = currentY - startPos.y;
        
        if (isShiftPressed) {
          const size = Math.max(Math.abs(width), Math.abs(height));
          width = width >= 0 ? size : -size;
          height = height >= 0 ? size : -size;
        }
        
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (tool === "circle") {
        const radius = Math.sqrt(
          Math.pow(currentX - startPos.x, 2) + Math.pow(currentY - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (tool === "pen") {
      setIsDrawing(false);
      setStartPos(null);
      saveToHistory();
      updateColorUsage(color);
    } else if (tool === "eraser") {
      setIsDrawing(false);
      setStartPos(null);
      saveToHistory();
    } else if (tool === "rectangle" || tool === "circle") {
      setIsDrawing(false);
      if (startPos) {
        saveToHistory();
        updateColorUsage(color);
      }
      setStartPos(null);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!tempText.trim()) {
      setTextInput(null);
      setTextInputPosition(null);
      setTempText("");
      return;
    }

    saveToHistory();

    ctx.fillStyle = color;
    ctx.font = `${Math.max(strokeWidth * 5, 14)}px Arial`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(tempText.trim(), textInput.x, textInput.y);

    setTextInput(null);
    setTextInputPosition(null);
    setTempText("");
    saveToHistory();
    updateColorUsage(color);
  };

  const handleTextCancel = () => {
    setTextInput(null);
    setTextInputPosition(null);
    setTempText("");
  };

  const updateColorUsage = (newColor: string) => {
    setColorUsage((prev) => {
      const existing = prev.find((c) => c.color === newColor);
      const updated = existing
        ? prev.map((c) => (c.color === newColor ? { ...c, count: c.count + 1 } : c))
        : [...prev, { color: newColor, count: 1 }];
      
      const sorted = updated.sort((a, b) => b.count - a.count).slice(0, 10);
      localStorage.setItem("whiteboard-color-usage", JSON.stringify(sorted));
      return sorted;
    });
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (historyStep > 0 && prevHistory.length > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return prevHistory;
        const ctx = canvas.getContext("2d");
        if (!ctx) return prevHistory;

        const newStep = historyStep - 1;
        if (prevHistory[newStep]) {
          ctx.putImageData(prevHistory[newStep], 0, 0);
          setHistoryStep(newStep);
        }
      }
      return prevHistory;
    });
  };

  const handleRedo = () => {
    setHistory((prevHistory) => {
      if (historyStep < prevHistory.length - 1) {
        const canvas = canvasRef.current;
        if (!canvas) return prevHistory;
        const ctx = canvas.getContext("2d");
        if (!ctx) return prevHistory;

        const newStep = historyStep + 1;
        if (prevHistory[newStep]) {
          ctx.putImageData(prevHistory[newStep], 0, 0);
          setHistoryStep(newStep);
        }
      }
      return prevHistory;
    });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
    toast({
      title: "Canvas gelöscht",
      description: "Das Whiteboard wurde zurückgesetzt.",
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whiteboard-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });

    toast({
      title: "Whiteboard gespeichert",
      description: "Dein Whiteboard wurde erfolgreich heruntergeladen.",
    });
  };

  const handleExport = () => {
    handleSave();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveToHistory();
        toast({
          title: "Bild importiert",
          description: "Das Bild wurde erfolgreich auf das Whiteboard geladen.",
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleNew = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialImageData]);
    setHistoryStep(0);
    
    toast({
      title: "Neues Whiteboard",
      description: "Ein neues Whiteboard wurde erstellt.",
    });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    updateColorUsage(selectedColor);
  };

  const handleAddCustomColor = () => {
    if (!customColors.includes(tempColor)) {
      setCustomColors([...customColors, tempColor]);
    }
    setColor(tempColor);
    setColorPickerOpen(false);
    updateColorUsage(tempColor);
  };

  const ColorPicker = () => (
    <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
      <PopoverTrigger asChild>
        <button
          className="h-8 w-8 rounded border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-colors"
          title="Farbe hinzufügen"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Farbe auswählen</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Farbpalette</label>
            <div className="flex flex-wrap gap-2">
              {customColors.map((c, idx) => (
                <button
                  key={idx}
                  className="h-8 w-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c, borderColor: c === color ? "#000" : "transparent" }}
                  onClick={() => {
                    setTempColor(c);
                    handleColorSelect(c);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddCustomColor} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Hinzufügen
            </Button>
            <Button variant="outline" onClick={() => setColorPickerOpen(false)}>
              Abbrechen
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-16 lg:space-y-24">
      <PageHeader
        icon={PenTool}
        title="Whiteboards"
        description="Kollaboratives Zeichenbrett für Ideen und Visualisierungen"
      />
      
    <div ref={containerRef} className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar mit Tools und Eigenschaften */}
      <div className="w-64 border-r bg-card shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Werkzeuge</h3>
        </div>
        
        {/* Tools */}
        <div className="p-4 border-b space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={tool === "pen" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("pen")}
              title="Stift"
              className="flex flex-col h-auto py-2"
            >
              <PenTool className="h-4 w-4 mb-1" />
              <span className="text-xs">Stift</span>
            </Button>
            <Button
              variant={tool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("text")}
              title="Text"
              className="flex flex-col h-auto py-2"
            >
              <Type className="h-4 w-4 mb-1" />
              <span className="text-xs">Text</span>
            </Button>
            <Button
              variant={tool === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("rectangle")}
              title="Rechteck"
              className="flex flex-col h-auto py-2"
            >
              <Square className="h-4 w-4 mb-1" />
              <span className="text-xs">Rechteck</span>
            </Button>
            <Button
              variant={tool === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("circle")}
              title="Kreis"
              className="flex flex-col h-auto py-2"
            >
              <Circle className="h-4 w-4 mb-1" />
              <span className="text-xs">Kreis</span>
            </Button>
            <Button
              variant={tool === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                document.getElementById("image-upload")?.click();
              }}
              title="Bild"
              className="flex flex-col h-auto py-2"
            >
              <Image className="h-4 w-4 mb-1" />
              <span className="text-xs">Bild</span>
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant={tool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setTool("eraser")}
              title="Radiergummi"
              className="flex flex-col h-auto py-2"
            >
              <Eraser className="h-4 w-4 mb-1" />
              <span className="text-xs">Radierer</span>
            </Button>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              className="flex-1"
              title="Rückgängig"
              onClick={handleUndo}
              disabled={historyStep <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-1"
              title="Wiederholen"
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border-t pt-2 mt-2 space-y-2">
            <label className="text-xs font-medium text-muted-foreground block">Zoom & Ansicht</label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleZoomOut}
                title="Verkleinern"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[50px]"
                onClick={handleResetZoom}
                title="Zoom zurücksetzen"
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleZoomIn}
                title="Vergrößern"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Vollbild beenden
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Vollbild
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Eigenschaften */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Farbe</label>
              <div className="flex flex-wrap gap-2">
                {customColors.map((c, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "h-8 w-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform",
                      c === color && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => handleColorSelect(c)}
                    title={c}
                  />
                ))}
                <ColorPicker />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                {tool === "eraser" ? "Radiergröße" : "Strichstärke"}: {strokeWidth}px
              </label>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                min={1}
                max={tool === "eraser" ? 100 : 50}
                step={1}
                className="w-full"
              />
            </div>
            {colorUsage.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Häufig verwendet
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorUsage.slice(0, 8).map((c, idx) => (
                    <button
                      key={idx}
                      className="h-8 w-8 rounded border cursor-pointer hover:scale-110 transition-transform relative group"
                      style={{ backgroundColor: c.color }}
                      onClick={() => handleColorSelect(c.color)}
                      title={`${c.color} (${c.count}x verwendet)`}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {c.count}x
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              <p className="font-medium mb-1">Tipps:</p>
              <ul className="space-y-0.5 text-[10px]">
                <li>• Shift + Stift = Gerade Linie</li>
                <li>• Shift + Rechteck = Quadrat</li>
                <li>• Kreise sind immer rund</li>
              </ul>
            </div>
            <div>
              <Button variant="outline" size="sm" className="w-full" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Canvas löschen
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b bg-card p-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold">Whiteboard</h1>
            <p className="text-xs text-muted-foreground">Kollaboratives Zeichenbrett</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="import-input"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("import-input")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-500" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Neu
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted/30 relative overflow-auto">
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            <canvas
              ref={canvasRef}
              className="cursor-crosshair shadow-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          {/* Text Input Overlay */}
          {textInput && textInputPosition && (
            <div
              className="absolute z-50"
              style={{
                left: `${textInputPosition.left}px`,
                top: `${textInputPosition.top}px`,
              }}
            >
              <Input
                ref={textInputRef}
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTextSubmit();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleTextCancel();
                  }
                }}
                onBlur={handleTextSubmit}
                autoFocus
                className="min-w-[200px] bg-background border-2 border-primary shadow-lg"
                placeholder="Text eingeben..."
                style={{
                  fontSize: `${Math.max(strokeWidth * 5, 14)}px`,
                  color: color,
                  padding: "8px 12px",
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

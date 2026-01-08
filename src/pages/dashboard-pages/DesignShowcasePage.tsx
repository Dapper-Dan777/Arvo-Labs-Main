import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle2, 
  Clock,
  Activity,
  Target,
  BarChart3,
  ArrowRight,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// LIQUID INTELLIGENCE DESIGN SHOWCASE
// ============================================================

interface MorphingCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
  className?: string;
}

// Organische Morphing Card mit Glassmorphism
function MorphingCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  gradient,
  trend,
  delay = 0,
  className 
}: MorphingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [countValue, setCountValue] = useState(0);
  
  // Count-up Animation
  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, '')) || 0;
    if (numValue > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = numValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setCountValue(numValue);
          clearInterval(timer);
        } else {
          setCountValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [value]);

  const displayValue = typeof value === 'number' 
    ? countValue 
    : value.toString().includes('%') 
      ? `${countValue}%` 
      : value;

  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        'rounded-[2rem] p-6',
        'backdrop-blur-xl bg-gradient-to-br',
        'border border-white/10',
        'transition-all duration-700 ease-out',
        'hover:scale-[1.02] hover:shadow-2xl',
        'animate-in fade-in slide-in-from-bottom-4',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradient}40, ${gradient}20)`,
        boxShadow: isHovered 
          ? `0 20px 60px -15px ${gradient}40, 0 0 40px -10px ${gradient}20`
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulsierender Hintergrund-Effekt */}
      <div 
        className={cn(
          'absolute inset-0 rounded-[2rem]',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-700',
          'animate-pulse-slow'
        )}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${gradient}20, transparent 70%)`,
        }}
      />
      
      {/* Organische Form - Top Right */}
      <div 
        className={cn(
          'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl',
          'opacity-30 group-hover:opacity-50',
          'transition-all duration-1000 ease-out',
          'group-hover:scale-150 group-hover:-translate-y-4'
        )}
        style={{ background: gradient }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/70 mb-1">{title}</p>
            <p 
              className="text-4xl font-bold text-foreground mb-2"
              style={{
                background: `linear-gradient(135deg, ${gradient}, ${gradient}CC)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {displayValue}
            </p>
            {description && (
              <p className="text-xs text-foreground/50">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp 
                  className={cn(
                    'w-3 h-3',
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  )} 
                />
                <span className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}% vs. letzte Woche
                </span>
              </div>
            )}
          </div>
          
          {/* Icon Container mit Morphing */}
          <div 
            className={cn(
              'p-4 rounded-2xl',
              'transition-all duration-500 ease-out',
              'group-hover:scale-110 group-hover:rotate-3'
            )}
            style={{
              background: `linear-gradient(135deg, ${gradient}30, ${gradient}10)`,
              boxShadow: `0 8px 32px ${gradient}20`,
            }}
          >
            <Icon 
              className={cn(
                'w-6 h-6 transition-all duration-500',
                'group-hover:scale-125'
              )}
              style={{ color: gradient }}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Glow */}
      <div 
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 rounded-full',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-700'
        )}
        style={{ background: gradient }}
      />
    </div>
  );
}

// Data Stream Verbindung zwischen Cards (vereinfacht für bessere Kompatibilität)
function DataStream({ 
  from, 
  to, 
  color,
  animated = true 
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number }; 
  color: string;
  animated?: boolean;
}) {
  const gradientId = `stream-${color.replace('#', '').replace(/[^a-zA-Z0-9]/g, '')}`;
  
  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ overflow: 'visible', width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 30} ${to.x} ${to.y}`}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
        className={animated ? 'animate-pulse' : ''}
        style={{
          filter: `blur(1px)`,
          opacity: animated ? 0.6 : 0.4,
        }}
      />
      {/* Pulsierende Punkte */}
      {animated && (
        <>
          <circle
            cx={from.x}
            cy={from.y}
            r="3"
            fill={color}
            opacity="0.8"
            className="animate-ping"
          />
          <circle
            cx={to.x}
            cy={to.y}
            r="3"
            fill={color}
            opacity="0.8"
            style={{ 
              animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
              animationDelay: '1.5s'
            }}
          />
        </>
      )}
    </svg>
  );
}

// Organische Grid Container
function OrganicGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Hintergrund-Partikel */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(79, 70, 229, ${Math.random() * 0.3 + 0.1})`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}

const DesignShowcasePage = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => [
    {
      title: 'Erledigte Tasks',
      value: 47,
      description: 'Diese Woche',
      icon: CheckCircle2,
      gradient: '#4facfe',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Ausstehend',
      value: 8,
      description: 'Heute fällig',
      icon: Clock,
      gradient: '#fa709a',
    },
    {
      title: 'Team-Aktivität',
      value: '87%',
      description: 'Engagement-Rate',
      icon: TrendingUp,
      gradient: '#30cfd0',
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Zeitbuchungen',
      value: 124,
      description: 'Gesamt erfasst',
      icon: Activity,
      gradient: '#a855f7',
    },
  ], []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in pt-4 pb-20">
      {/* Header mit Glassmorphism */}
      <div className="relative">
        <div 
          className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #a855f7 100%)',
          }}
        />
        <div className="relative backdrop-blur-xl bg-background/50 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="p-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Liquid Intelligence Design
              </h1>
              <p className="text-muted-foreground">
                Organische Formen, dynamische Farben & fließende Datenvisualisierungen
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Glassmorphism</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Morphing Cards</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Data Streams</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">Dynamic Gradients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards mit organischem Grid */}
      <div className="relative">
        <OrganicGrid>
          {stats.map((stat, index) => (
            <MorphingCard
              key={stat.title}
              {...stat}
              delay={index * 100}
            />
          ))}
        </OrganicGrid>
      </div>

      {/* Feature Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breathing UI Demo */}
        <div 
          className="group relative overflow-hidden rounded-[2rem] p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(168, 85, 247, 0.1))',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                }}
              >
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Breathing UI</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Subtile Puls-Animationen verleihen der UI Lebendigkeit. 
              Jedes Element "atmet" sanft und reagiert auf Interaktionen.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Play className="w-4 h-4" />
              <span>Hover über die Cards um den Effekt zu sehen</span>
            </div>
          </div>
        </div>

        {/* Data Streams Demo */}
        <div 
          className="group relative overflow-hidden rounded-[2rem] p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.1), rgba(48, 207, 208, 0.1))',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #fa709a, #30cfd0)',
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Data Streams</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Visuelle Verbindungen zwischen verwandten Daten zeigen den 
              Datenfluss wie ein neuronales Netzwerk.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <ArrowRight className="w-4 h-4" />
              <span>Daten fließen organisch zwischen Elementen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div className="relative">
        <div 
          className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #a855f7 100%)',
          }}
        />
        <div className="relative backdrop-blur-xl bg-background/50 border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Design-Prinzipien</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Organisch',
                description: 'Fließende Formen statt harte Linien. Jedes Element hat eine einzigartige, leicht asymmetrische Form.',
                icon: Target,
                gradient: '#4facfe',
              },
              {
                title: 'Dynamisch',
                description: 'Farben und Formen passen sich automatisch an Daten an. Nichts ist statisch.',
                icon: BarChart3,
                gradient: '#fa709a',
              },
              {
                title: 'Lebendig',
                description: 'Subtile Animationen und Mikro-Interaktionen verleihen der UI eine eigene Persönlichkeit.',
                icon: Users,
                gradient: '#30cfd0',
              },
            ].map((principle, index) => (
              <div
                key={principle.title}
                className="group p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${principle.gradient}10, ${principle.gradient}05)`,
                }}
              >
                <div 
                  className="p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${principle.gradient}, ${principle.gradient}CC)`,
                  }}
                >
                  <principle.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcasePage;

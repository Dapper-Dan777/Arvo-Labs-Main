"use client";

import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

// Format number with proper formatting
function formatNumber(value: number | string): string {
  if (typeof value === 'string' && value.includes('%')) {
    const num = parseInt(value.toString().replace(/\D/g, '')) || 0;
    return `${num}%`;
  }
  const num = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, '')) || 0;
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function PremiumStatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  delay = 0
}: PremiumStatCardProps) {
  const [countValue, setCountValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isPercentage = typeof value === 'string' && value.includes('%');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
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
  }, [value, isMounted]);

  const displayValue = isPercentage
    ? `${formatNumber(countValue)}%`
    : formatNumber(countValue);

  return (
    <div
      className={cn(
        'group relative overflow-visible',
        'glass-premium rounded-premium-xl',
        'p-6',
        'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-2',
        'before:absolute before:inset-0 before:rounded-premium-xl',
        'before:bg-gradient-to-br',
        'before:from-[var(--color-primary-start)]/0 before:via-[var(--color-primary-middle)]/0 before:to-[var(--color-primary-end)]/0',
        'before:opacity-0 before:transition-opacity before:duration-700',
        'hover:before:opacity-[0.06]',
        'after:absolute after:inset-0 after:rounded-premium-xl',
        'after:bg-gradient-to-br after:from-white/0 after:to-transparent',
        'after:opacity-0 after:transition-opacity after:duration-700',
        'hover:after:opacity-100',
        !isMounted && 'opacity-0 translate-y-4'
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-default)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Multi-layer glow effect */}
      <div 
        className="absolute -inset-[3px] rounded-premium-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-start) 0%, var(--color-primary-middle) 50%, var(--color-primary-end) 100%)',
        }}
      />
      
      {/* Inner highlight glow */}
      <div 
        className="absolute inset-[2px] rounded-premium-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
          filter: 'blur(8px)',
        }}
      />
      
      <div className="relative z-10 flex flex-row items-start justify-between gap-5">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <p 
            className="text-[10px] font-semibold tracking-[0.15em] uppercase leading-none"
            style={{ 
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.15em',
            }}
          >
            {title}
          </p>
          
          <div className="relative overflow-visible">
            <p 
              className={cn(
                'text-5xl font-semibold tracking-[-0.06em] leading-[0.9]',
                'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'break-words overflow-visible',
                isHovered && 'scale-[1.03]'
              )}
              style={{
                color: 'var(--color-text-primary)',
                fontFeatureSettings: '"tnum", "lnum", "zero", "ss01", "ss02", "kern"',
                fontVariantNumeric: 'tabular-nums',
                fontKerning: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              }}
            >
              {displayValue}
            </p>
            
            {/* Multi-layer text shadow for depth */}
            <div 
              className="absolute inset-0 text-5xl font-semibold tracking-[-0.06em] leading-[0.9] blur-[2px] -z-10 pointer-events-none"
              style={{ 
                color: 'var(--color-text-primary)', 
                opacity: 0.08,
                transform: 'translateY(1px)',
              }}
            >
              {displayValue}
            </div>
            
            {/* Schriftspiegelung im Hintergrund - Verfeinert */}
            <div 
              className="absolute top-full left-0 right-0 text-5xl font-semibold tracking-[-0.06em] leading-[0.9] pointer-events-none"
              style={{
                color: 'var(--color-text-primary)',
                fontFeatureSettings: '"tnum", "lnum", "zero", "ss01", "ss02", "kern"',
                fontVariantNumeric: 'tabular-nums',
                fontKerning: 'normal',
                transform: 'scaleY(-1) translateY(4px)',
                transformOrigin: 'top',
                opacity: 0.12,
                filter: 'blur(1.5px)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)',
              }}
            >
              {displayValue}
            </div>
          </div>
          
          {description && (
            <p 
              className="text-xs leading-relaxed font-medium"
              style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5',
              }}
            >
              {description}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <div 
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                  'text-[10px] font-semibold',
                  'backdrop-blur-sm',
                  'border',
                  'transition-all duration-300',
                  'group-hover:scale-105'
                )}
                style={{
                  color: trend.isPositive ? 'var(--color-success)' : 'var(--color-error)',
                  backgroundColor: trend.isPositive ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                  borderColor: trend.isPositive ? 'var(--color-success)' : 'var(--color-error)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  opacity: 0.8,
                }}
              >
                <TrendingUp className="w-2.5 h-2.5 flex-shrink-0" />
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              </div>
              <span 
                className="text-[10px] font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                vs. letzte Woche
              </span>
            </div>
          )}
        </div>
        
        {/* Right side - Icon Container */}
        <div 
          className={cn(
            'flex-shrink-0 p-3 rounded-premium-lg',
            'backdrop-blur-sm',
            'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'group-hover:scale-110 group-hover:rotate-3',
            'group-hover:shadow-premium-lg',
            'relative overflow-hidden',
            'before:absolute before:inset-0 before:rounded-premium-lg',
            'before:bg-gradient-to-br',
            'before:from-[var(--color-primary-start)]/0 before:to-[var(--color-primary-end)]/0',
            'before:opacity-0 before:transition-opacity before:duration-700',
            'group-hover:before:opacity-12'
          )}
          style={{
            background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)',
            borderColor: 'var(--color-border-default)',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Icon 
            className="w-5 h-5 relative z-10 transition-transform duration-700 group-hover:scale-110" 
            style={{ color: 'var(--color-text-secondary)' }}
          />
        </div>
      </div>
      
      {/* Bottom accent line - direkt am Rand */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[3px] transition-opacity duration-700"
        style={{
          background: 'linear-gradient(to right, transparent 0%, var(--color-primary-start) 20%, var(--color-primary-middle) 50%, var(--color-primary-end) 80%, transparent 100%)',
          opacity: 0.5,
        }}
      />
      
      {/* Hover shadow enhancement */}
      <div 
        className="absolute inset-0 rounded-premium-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: '0 32px 100px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(99, 102, 241, 0.1)',
        }}
      />
    </div>
  );
}

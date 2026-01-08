"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  delay?: number;
}

export function PremiumFeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  path,
  delay = 0
}: PremiumFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={path}>
      <div
        className={cn(
          'group relative overflow-hidden',
          'glass-premium rounded-premium-xl p-7',
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
          'cursor-pointer',
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
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-start gap-4">
            <div 
              className={cn(
                'p-3.5 rounded-premium-lg',
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
            <div className="flex-1 min-w-0">
              <h3 
                className={cn(
                  'text-lg font-semibold tracking-tight mb-1.5',
                  'transition-all duration-700',
                  isHovered && 'scale-[1.02]'
                )}
                style={{ color: 'var(--color-text-primary)' }}
              >
                {title}
              </h3>
              <p 
                className="text-sm leading-relaxed font-medium"
                style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                {description}
              </p>
            </div>
            <ArrowRight 
              className={cn(
                'w-4 h-4 flex-shrink-0 transition-all duration-700',
                'group-hover:translate-x-1.5 group-hover:scale-110'
              )}
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
    </Link>
  );
}

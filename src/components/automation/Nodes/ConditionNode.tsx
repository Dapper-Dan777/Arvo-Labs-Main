'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { LucideIcon, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionNodeProps {
  data: {
    label: string;
    icon?: LucideIcon;
    integration: string;
    description?: string;
    stepNumber?: number;
    isConfigured?: boolean;
  };
  selected?: boolean;
  id?: string;
}

export const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
  const Icon = data.icon || GitBranch;
  const stepNumber = data?.stepNumber || 2;
  const isConfigured = data?.isConfigured !== false;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white/20"
      />
      
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative w-[280px] rounded-2xl",
          "backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
          "border border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.37)]",
          "transition-all duration-300",
          "preserve-3d",
          selected ? 'ring-2 ring-orange-500/50 shadow-orange-500/20' : ''
        )}
        style={{
          transform: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Step Number Badge - Zapier Style */}
        <div 
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-md z-10"
        >
          {stepNumber}
        </div>

        {/* Status Indicator */}
        <div 
          className={cn(
            "absolute top-2 right-2 w-2 h-2 rounded-full",
            isConfigured ? "bg-green-500" : "bg-yellow-500"
          )}
          title={isConfigured ? "Configured" : "Not Configured"} 
        />

        {/* Gradient Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500" />
        
        {/* Content */}
        <div className="relative z-10 p-5 flex items-start gap-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-white/10"
          >
            <Icon className="w-6 h-6 text-orange-300" />
          </motion.div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wide mb-1">
              Condition
            </div>
            <h3 className="text-white font-semibold text-base mb-1 truncate">
              {data.label}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2">
              {data.description || `${data.integration} · Condition`}
            </p>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* True Path Handle */}
      <div className="relative">
        <Handle 
          type="source" 
          position={Position.Right} 
          id="true" 
          className="!w-3 !h-3 !bg-green-500 !border-2 !border-white/20 !top-[30%]" 
        />
        <div className="absolute right-8 top-[calc(30%-6px)] text-[10px] font-semibold text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800 pointer-events-none">
          TRUE
        </div>
      </div>

      {/* False Path Handle */}
      <div className="relative">
        <Handle 
          type="source" 
          position={Position.Right} 
          id="false" 
          className="!w-3 !h-3 !bg-red-500 !border-2 !border-white/20 !top-[70%]" 
        />
        <div className="absolute right-8 top-[calc(70%-6px)] text-[10px] font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800 pointer-events-none">
          FALSE
        </div>
      </div>
    </>
  );
});

ConditionNode.displayName = 'ConditionNode';


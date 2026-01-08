'use client';

import { useCallback } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { motion } from 'framer-motion';

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  sourceHandleId,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine edge color based on source handle
  const getEdgeColor = () => {
    if (sourceHandleId === 'true') return 'url(#edge-gradient-green)';
    if (sourceHandleId === 'false') return 'url(#edge-gradient-red)';
    return 'url(#edge-gradient-blue)';
  };

  return (
    <>
      {/* Glow Layer */}
      <path
        id={`${id}-glow`}
        d={edgePath}
        fill="none"
        stroke={getEdgeColor()}
        strokeWidth={selected ? 4 : 3}
        className="opacity-30 blur-sm"
      />

      {/* Main Path */}
      <motion.path
        id={id}
        d={edgePath}
        fill="none"
        stroke={getEdgeColor()}
        strokeWidth={selected ? 3 : 2}
        markerEnd={markerEnd}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Animated Particle */}
      <motion.circle
        r="4"
        fill={sourceHandleId === 'true' ? '#10b981' : sourceHandleId === 'false' ? '#ef4444' : '#A855F7'}
        className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </motion.circle>

      {/* Edge Label (optional) */}
      {selected && (
        <EdgeLabelRenderer>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white text-xs font-medium"
          >
            Connection
          </motion.div>
        </EdgeLabelRenderer>
      )}

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="edge-gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="edge-gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="edge-gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
      </defs>
    </>
  );
}


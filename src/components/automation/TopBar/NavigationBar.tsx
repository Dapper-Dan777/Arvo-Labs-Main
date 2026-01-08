'use client';

import { motion } from 'framer-motion';
import { Save, Play, Settings, Sparkles, Clock, Check } from 'lucide-react';
import { useState } from 'react';

interface NavigationBarProps {
  workflowName: string;
  status: 'draft' | 'running' | 'live' | 'error';
  onSave: () => Promise<void>;
  onTest: () => Promise<void>;
  lastSaved?: Date;
}

export function NavigationBar({ 
  workflowName, 
  status, 
  onSave, 
  onTest,
  lastSaved 
}: NavigationBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave();
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleTest = async () => {
    setIsTesting(true);
    await onTest();
    setIsTesting(false);
  };

  const statusConfig = {
    draft: { color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Draft' },
    running: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Running', pulse: true },
    live: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Live', pulse: true },
    error: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Error' },
  };

  const currentStatus = statusConfig[status];

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-20 backdrop-blur-2xl bg-[#0A0A0F]/80 border-b border-white/5"
    >
      <div className="max-w-[1920px] mx-auto px-8 h-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Arvo Labs</span>
          </motion.div>

          <div className="w-px h-8 bg-white/10" />

          {/* Workflow Name */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
            >
              <h1 className="text-white font-semibold text-base">
                {workflowName}
              </h1>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bg} border border-white/10`}
            >
              <div className={`w-2 h-2 rounded-full ${currentStatus.bg.replace('/20', '')} ${currentStatus.pulse ? 'animate-pulse' : ''}`} />
              <span className={`text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </motion.div>

            {/* Last Saved */}
            {lastSaved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-500 text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>Saved {formatTimeAgo(lastSaved)}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Test Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTest}
            disabled={isTesting}
            className="group relative px-6 py-3 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-300" />
            <div className="absolute inset-0 border border-emerald-500/30 rounded-2xl" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            
            {/* Content */}
            <div className="relative flex items-center gap-2">
              <Play className={`w-4 h-4 text-emerald-400 ${isTesting ? 'animate-pulse' : ''}`} />
              <span className="text-emerald-400 font-semibold">
                {isTesting ? 'Testing...' : 'Test Run'}
              </span>
            </div>
          </motion.button>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="group relative px-6 py-3 rounded-2xl overflow-hidden disabled:opacity-50"
          >
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300" />
            
            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            
            {/* Content */}
            <div className="relative flex items-center gap-2">
              {isSaving ? (
                <Check className="w-4 h-4 text-white animate-scale-in" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
              <span className="text-white font-semibold">
                {isSaving ? 'Saved!' : 'Speichern'}
              </span>
            </div>

            {/* Glow Shadow */}
            <div className="absolute inset-0 rounded-2xl shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow duration-300 -z-10" />
          </motion.button>

          {/* Settings Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}


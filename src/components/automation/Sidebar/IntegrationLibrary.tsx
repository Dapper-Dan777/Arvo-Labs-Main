'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, Workflow, ChevronDown, X } from 'lucide-react';
import { TRIGGERS, ACTIONS, CATEGORIES, getIcon, type Trigger, type Action } from '@/lib/automation/integrations/data';
import { cn } from '@/lib/utils';

type TabType = 'triggers' | 'actions';

export function IntegrationLibrary() {
  const [activeTab, setActiveTab] = useState<TabType>('triggers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get items based on active tab
  const items = useMemo(() => {
    return activeTab === 'triggers' ? TRIGGERS : ACTIONS;
  }, [activeTab]);

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return Array.from(cats);
  }, [items]);

  // Filter items by search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Get category count
  const getCategoryCount = (category: string) => {
    return items.filter(item => item.category === category).length;
  };

  // Get color gradient for category
  const getCategoryGradient = (category: string) => {
    const catConfig = CATEGORIES[category as keyof typeof CATEGORIES];
    if (!catConfig) return 'from-gray-500/20 to-gray-500/20';
    
    const colorMap: Record<string, string> = {
      red: 'from-red-500/20 to-pink-500/20',
      purple: 'from-purple-500/20 to-pink-500/20',
      orange: 'from-orange-500/20 to-red-500/20',
      indigo: 'from-indigo-500/20 to-purple-500/20',
      green: 'from-green-500/20 to-emerald-500/20',
      blue: 'from-blue-500/20 to-cyan-500/20',
      yellow: 'from-yellow-500/20 to-orange-500/20',
      cyan: 'from-cyan-500/20 to-blue-500/20',
      pink: 'from-pink-500/20 to-purple-500/20',
      gray: 'from-gray-500/20 to-gray-600/20',
    };
    
    return colorMap[catConfig.color] || 'from-gray-500/20 to-gray-500/20';
  };

  const getIntegrationGradient = (item: Trigger | Action) => {
    const from = item.color.from.replace(/\d+/, (match) => match);
    const to = item.color.to.replace(/\d+/, (match) => match);
    return `from-${from}/20 to-${to}/20`;
  };

  return (
    <motion.aside
      initial={{ x: -400, opacity: 0 }}
      animate={{ 
        x: isCollapsed ? -320 : 0, 
        opacity: 1 
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-80 h-full backdrop-blur-2xl bg-[#0A0A0F]/60 border-r border-white/5 overflow-hidden flex flex-col"
    >
      {/* Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
              <Workflow className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-white font-bold text-lg">Integrations</h2>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('triggers');
              setSelectedCategory('all');
            }}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'triggers'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            )}
          >
            Triggers ({TRIGGERS.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('actions');
              setSelectedCategory('all');
            }}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'actions'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            )}
          >
            Actions ({ACTIONS.length})
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="relative z-10 px-6 py-3 border-b border-white/5 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2 min-w-max">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              )}
            >
              All ({items.length})
            </motion.button>
            {availableCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  selectedCategory === category
                    ? `${getCategoryGradient(category)} bg-gradient-to-r text-white border border-white/20`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                )}
              >
                {CATEGORIES[category as keyof typeof CATEGORIES]?.label || category} ({getCategoryCount(category)})
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Integration Cards */}
      <div className="relative z-10 flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const Icon = getIcon(item.icon);
              const gradient = getIntegrationGradient(item);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }}
                  draggable
                  onDragStart={(e) => {
                    const dragData = {
                      id: item.id,
                      app: item.app,
                      name: item.name,
                      description: item.description,
                      icon: item.icon,
                      category: item.category,
                      type: item.type,
                      color: item.color,
                    };
                    e.dataTransfer.setData('integration', JSON.stringify(dragData));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={cn(
                    "group relative p-4 rounded-2xl cursor-grab active:cursor-grabbing",
                    "backdrop-blur-xl bg-gradient-to-br",
                    gradient,
                    "border border-white/10 hover:border-white/20",
                    "transition-all duration-300",
                    "overflow-hidden"
                  )}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-xl",
                        `bg-gradient-to-br ${gradient}`,
                        "flex items-center justify-center",
                        "border border-white/10",
                        "shadow-lg"
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors line-clamp-1 flex-1 min-w-0">
                          {item.name}
                        </h3>
                        {/* Category Badge - Inline instead of absolute */}
                        <div className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap flex-shrink-0 ml-2",
                          `bg-gradient-to-r ${getCategoryGradient(item.category)}`,
                          "text-white border border-white/20"
                        )}>
                          {CATEGORIES[item.category as keyof typeof CATEGORIES]?.label || item.category}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs font-medium mb-1">{item.app}</p>
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "linear",
                      repeatDelay: 2 
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No {activeTab} found</p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 text-purple-400 text-xs hover:text-purple-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

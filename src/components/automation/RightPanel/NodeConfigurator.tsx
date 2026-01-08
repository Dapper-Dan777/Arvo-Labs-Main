'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Eye, Zap, Settings2, Copy, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Node } from 'reactflow';
import { ACTIONS, TRIGGERS, getIcon, type IntegrationField } from '@/lib/automation/integrations/data';
import { cn } from '@/lib/utils';

interface NodeConfiguratorProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function NodeConfigurator({ node, onUpdate, onClose }: NodeConfiguratorProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'code'>('config');
  const [config, setConfig] = useState(node.data.config || {});
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  // Get integration definition
  const integrationDef = useMemo(() => {
    if (node.data.type === 'trigger') {
      return TRIGGERS.find(t => t.id === node.data.integration);
    } else {
      return ACTIONS.find(a => a.id === node.data.integration);
    }
  }, [node.data.integration, node.data.type]);

  // Get fields from integration
  const fields = useMemo(() => {
    if (!integrationDef) return [];
    if (node.data.type === 'action' && 'fields' in integrationDef) {
      return integrationDef.fields || [];
    }
    return [];
  }, [integrationDef, node.data.type]);

  const handleUpdate = () => {
    onUpdate(node.id, { ...node.data, config });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 500, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-20 bottom-0 w-[480px] z-40 backdrop-blur-2xl bg-[#0A0A0F]/90 border-l border-white/10 shadow-2xl flex flex-col"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                {node.data.icon && <node.data.icon className="w-6 h-6 text-purple-400" />}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{node.data.label}</h2>
                <p className="text-gray-400 text-sm">{node.data.integration}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'config', label: 'Configure', icon: Settings2 },
              { id: 'code', label: 'Code', icon: Code },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'config' ? (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Dynamic Form Fields based on Integration */}
                {fields.length > 0 ? (
                  fields.map((field) => (
                    <DynamicFormField
                      key={field.name}
                      field={field}
                      value={config[field.name] || ''}
                      onChange={(value) => setConfig({ ...config, [field.name]: value })}
                      availableFields={availableFields}
                      onInsertField={(placeholder) => {
                        const currentValue = config[field.name] || '';
                        setConfig({ ...config, [field.name]: `${currentValue}{{${placeholder}}}` });
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No configuration fields available for this {node.data.type}
                  </div>
                )}

                {/* Field Mapping Helper */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-medium text-sm mb-1">Field Mapping</h4>
                      <p className="text-gray-400 text-xs">
                        Use{' '}
                        <code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300">
                          {`{{trigger.field}}`}
                        </code>{' '}
                        to reference previous step data
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-300 overflow-x-auto font-mono">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 p-6 border-t border-white/10 flex-shrink-0 bg-[#0A0A0F]/90 backdrop-blur-xl">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdate}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Dynamic Form Field Component
function DynamicFormField({
  field,
  value,
  onChange,
  availableFields,
  onInsertField,
}: {
  field: IntegrationField;
  value: any;
  onChange: (value: any) => void;
  availableFields: string[];
  onInsertField: (placeholder: string) => void;
}) {
  const Icon = Zap;

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          >
            {!value && <option value="">Select...</option>}
            {field.options?.map((option) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;
              return (
                <option key={optValue} value={optValue} className="bg-gray-800">
                  {optLabel}
                </option>
              );
            })}
          </select>
        );
      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                onChange(e.target.value);
              }
            }}
            placeholder={field.placeholder || '{}'}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none font-mono text-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all",
              field.required ? "border-white/10" : "border-white/5"
            )}
          />
        );
    }
  };

  return (
    <div>
      <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-400" />
          {field.label}
          {field.required && <span className="text-red-400">*</span>}
        </div>
        {availableFields.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Simple placeholder insertion for now
              const placeholder = `trigger.${availableFields[0] || 'field'}`;
              onInsertField(placeholder);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            Insert Field
          </motion.button>
        )}
      </label>
      {field.description && (
        <p className="text-xs text-gray-500 mb-2">{field.description}</p>
      )}
      {renderInput()}
    </div>
  );
}



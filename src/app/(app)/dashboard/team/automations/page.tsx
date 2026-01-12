'use client';

import { useState, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { motion } from 'framer-motion';
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow';

import { Canvas3DBackground } from '@/components/automation/Canvas/BackgroundEffects';
import { AutomationCanvas } from '@/components/automation/Canvas/AutomationCanvas';
import { IntegrationLibrary } from '@/components/automation/Sidebar/IntegrationLibrary';
import { NavigationBar } from '@/components/automation/TopBar/NavigationBar';
import { NodeConfigurator } from '@/components/automation/RightPanel/NodeConfigurator';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function AutomationsPage() {
  const [workflowName, setWorkflowName] = useState('Customer Onboarding');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();

  const handleSave = useCallback(async () => {
    // TODO: Implement save to backend
    console.log('Saving workflow:', { workflowName, nodes, edges });
    setLastSaved(new Date());
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }, [workflowName, nodes, edges]);

  const handleTest = useCallback(async () => {
    // TODO: Implement test execution
    setIsExecuting(true);
    console.log('Testing workflow:', { workflowName, nodes, edges });
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExecuting(false);
  }, [workflowName, nodes, edges]);

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
    setSelectedNode(null);
  }, [setNodes]);

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);

  const handleAddNode = useCallback((newNode: Node) => {
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleAddEdge = useCallback((newEdge: Edge) => {
    setEdges((eds) => [...eds, newEdge]);
  }, [setEdges]);

  return (
    <ReactFlowProvider>
      <div className="relative h-screen w-full overflow-hidden bg-background dark:bg-[#0A0A0F]">
        {/* 3D Background with Particles - Disabled to avoid blocking interactions */}
        {/* <Canvas3DBackground /> */}

        {/* Top Navigation Bar */}
        <NavigationBar 
          workflowName={workflowName}
          status={isExecuting ? 'running' : 'draft'}
          onSave={handleSave}
          onTest={handleTest}
          lastSaved={lastSaved}
        />

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)] mt-[80px]">
          {/* Left Sidebar - Integration Library */}
          <IntegrationLibrary />

          {/* Center Canvas */}
          <div className="flex-1 relative">
            <AutomationCanvas
              nodes={nodes}
              edges={edges}
              onNodeSelect={handleNodeSelect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onAddNode={handleAddNode}
              onAddEdge={handleAddEdge}
            />
          </div>

          {/* Right Panel - Node Configurator */}
          {selectedNode && (
            <NodeConfigurator
              node={selectedNode}
              onUpdate={handleNodeUpdate}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

'use client';

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';

import { TriggerNode } from '../Nodes/TriggerNode';
import { ActionNode } from '../Nodes/ActionNode';
import { ConditionNode } from '../Nodes/ConditionNode';
import { AnimatedEdge } from '../Nodes/AnimatedEdge';
import { Zap, Mail, MessageSquare, CreditCard, Database, Clock } from 'lucide-react';

// Icon mapping for integrations
const iconMap: Record<string, any> = {
  webhook: Zap,
  schedule: Clock,
  stripe: CreditCard,
  email: Mail,
  slack: MessageSquare,
  database: Database,
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

interface AutomationCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node | null) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onAddNode: (node: Node) => void;
}

export function AutomationCanvas({
  nodes,
  edges,
  onNodeSelect,
  onNodesChange,
  onEdgesChange,
  onAddNode,
  onAddEdge,
}: AutomationCanvasProps) {
  const { project, screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      // Determine edge color based on source handle
      let edgeColor = "#6366f1"; // Default: Blue
      if (params.sourceHandle === "true") {
        edgeColor = "#10b981"; // Green for True Path
      } else if (params.sourceHandle === "false") {
        edgeColor = "#ef4444"; // Red for False Path
      }
      
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: "animated",
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 2 },
        label: params.sourceHandle === "true" ? "TRUE" : params.sourceHandle === "false" ? "FALSE" : undefined,
        labelStyle: { 
          fill: edgeColor, 
          fontWeight: 600, 
          fontSize: 10,
          background: "white",
          padding: "2px 6px",
          borderRadius: "4px",
        },
      };
      
      // Use ReactFlow's addEdge helper to properly add the edge
      const updatedEdges = addEdge(newEdge, edges);
      
      // If parent provides onAddEdge callback, use it
      if (onAddEdge) {
        onAddEdge(newEdge as Edge);
      } else {
        // Otherwise, we need to manually update edges
        // Since onEdgesChange from useEdgesState expects change objects,
        // we call it with the add change
        onEdgesChange([{ type: 'add', item: newEdge }]);
      }
    },
    [edges, onEdgesChange]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const data = event.dataTransfer.getData('integration');
      if (!data) return;

      try {
        const integration = JSON.parse(data);
        const position = screenToFlowPosition({ 
          x: event.clientX, 
          y: event.clientY 
        });

        // Calculate step number
        const triggerNodes = nodes.filter(n => n.type === 'trigger');
        const actionNodes = nodes.filter(n => n.type === 'action' || n.type === 'condition');
        
        let stepNumber: number;
        if (integration.type === 'trigger') {
          stepNumber = 1; // Trigger is always Step 1
        } else {
          stepNumber = 1 + triggerNodes.length + actionNodes.length;
        }

        // Get icon from mapping
        const IconComponent = iconMap[integration.id] || Zap;

        const newNode: Node = {
          id: `${integration.id}-${Date.now()}`,
          type: integration.type === 'trigger' ? 'trigger' : 'action',
          position,
          data: {
            label: integration.name,
            icon: IconComponent,
            integration: integration.id,
            app: integration.app,
            description: integration.description,
            category: integration.category,
            type: integration.type,
            stepNumber,
            isConfigured: false,
            config: {},
          },
        };

        onAddNode(newNode);
      } catch (error) {
        console.error('Error parsing integration data:', error);
      }
    },
    [screenToFlowPosition, nodes, onAddNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div 
      className="relative w-full h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => onNodeSelect(node)}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'animated',
          animated: true,
        }}
        className="!bg-transparent"
      >
        {/* Custom Background - Removed to avoid blocking interactions */}
        {/* <Background
          color="rgba(168, 85, 247, 0.1)"
          gap={40}
          size={2}
          variant="dots"
          className="!opacity-30"
        /> */}

        {/* Custom Controls */}
        <Controls
          className="!bg-white/5 !backdrop-blur-xl !border !border-white/10 !rounded-2xl"
          showInteractive={false}
        />

        {/* Premium MiniMap */}
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger': return '#F59E0B';
              case 'action': return '#A855F7';
              case 'condition': return '#3B82F6';
              default: return '#6B7280';
            }
          }}
          maskColor="rgba(10, 10, 15, 0.8)"
          className="!bg-white/5 !backdrop-blur-xl !border !border-white/10 !rounded-2xl !shadow-2xl"
        />
      </ReactFlow>

    </div>
  );
}


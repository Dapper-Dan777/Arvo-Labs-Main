import { Workflow, WorkflowExecution, ExecutionContext, ExecutionStepLog, WorkflowNode, WorkflowEdge } from './types';
import { getAdapter } from './adapters';
import { getSupabaseClient } from './supabase-client';

export class WorkflowExecutor {
  private workflow: Workflow;
  private context: ExecutionContext;
  private executionLog: ExecutionStepLog[] = [];

  constructor(workflow: Workflow, triggerData: any, userId: string, executionId: string) {
    this.workflow = workflow;
    this.context = {
      trigger: triggerData,
      steps: {},
      user_id: userId,
      execution_id: executionId,
    };
  }

  async execute(): Promise<WorkflowExecution> {
    const startTime = Date.now();
    const supabase = await getSupabaseClient();

    try {
      // Update execution status to 'running'
      await supabase
        .from('workflow_executions')
        .update({ status: 'running' })
        .eq('id', this.context.execution_id);

      // Sort nodes by dependencies (topological sort)
      const sortedNodes = this.topologicalSort(this.workflow.nodes, this.workflow.edges);

      // Execute each node
      for (const node of sortedNodes) {
        if (node.type === 'trigger') continue; // Skip trigger node

        const stepLog = await this.executeNode(node);
        this.executionLog.push(stepLog);

        if (stepLog.status === 'error') {
          throw new Error(`Step ${node.data.label} failed: ${stepLog.error}`);
        }
      }

      // Mark execution as success
      const duration = Date.now() - startTime;
      await supabase
        .from('workflow_executions')
        .update({
          status: 'success',
          execution_log: this.executionLog,
          completed_at: new Date().toISOString(),
          duration_ms: duration,
        })
        .eq('id', this.context.execution_id);

      return {
        id: this.context.execution_id,
        workflow_id: this.workflow.id,
        status: 'success',
        trigger_data: this.context.trigger,
        execution_log: this.executionLog,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
        duration_ms: duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      await supabase
        .from('workflow_executions')
        .update({
          status: 'error',
          execution_log: this.executionLog,
          error_message: error.message,
          completed_at: new Date().toISOString(),
          duration_ms: duration,
        })
        .eq('id', this.context.execution_id);

      throw error;
    }
  }

  private async executeNode(node: WorkflowNode): Promise<ExecutionStepLog> {
    const stepStartTime = Date.now();

    try {
      // Handle path/condition nodes
      if (node.type === 'path' || node.type === 'condition') {
        return await this.executeConditionNode(node);
      }

      // Get adapter for integration
      const adapter = getAdapter(node.data.integration);

      // Resolve field mappings ({{trigger.email}} -> actual value)
      const resolvedConfig = this.resolveConfig(node.data.config);

      // Execute action
      const output = await adapter.execute(node.data.action, resolvedConfig, this.context);

      // Store output in context
      this.context.steps[node.id] = output;

      return {
        node_id: node.id,
        step_name: node.data.label,
        status: 'success',
        input: resolvedConfig,
        output,
        duration_ms: Date.now() - stepStartTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        node_id: node.id,
        step_name: node.data.label,
        status: 'error',
        input: node.data.config,
        error: error.message,
        duration_ms: Date.now() - stepStartTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async executeConditionNode(node: WorkflowNode): Promise<ExecutionStepLog> {
    // For path/condition nodes, evaluate the condition
    // This is a simplified version - you can extend this with a proper expression evaluator
    const condition = node.data.config?.condition || '';
    const result = this.evaluateCondition(condition);

    return {
      node_id: node.id,
      step_name: node.data.label,
      status: result ? 'success' : 'skipped',
      input: { condition },
      output: { result },
      duration_ms: 0,
      timestamp: new Date().toISOString(),
    };
  }

  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    // You can extend this with a proper expression parser
    try {
      // Replace placeholders with actual values
      const resolved = this.resolvePlaceholders(condition);
      // Simple evaluation (can be extended)
      return Boolean(eval(resolved));
    } catch {
      return false;
    }
  }

  private resolveConfig(config: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        resolved[key] = this.resolvePlaceholders(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        resolved[key] = this.resolveConfig(value);
      } else if (Array.isArray(value)) {
        resolved[key] = value.map(item => 
          typeof item === 'string' ? this.resolvePlaceholders(item) : item
        );
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  private resolvePlaceholders(value: string): any {
    // Replace {{trigger.email}} or {{step_1.id}} with actual values
    return value.replace(/\{\{(.+?)\}\}/g, (_, path) => {
      const trimmedPath = path.trim();
      const parts = trimmedPath.split('.');
      let current: any = this.context;

      for (const part of parts) {
        if (part.startsWith('step_')) {
          // Handle step references: step_1.id -> steps[node_id].id
          const stepId = parts[0].replace('step_', '');
          const node = this.workflow.nodes.find(n => n.id === stepId);
          if (node && this.context.steps[node.id]) {
            current = this.context.steps[node.id];
            // Continue with remaining parts
            for (let i = 1; i < parts.length; i++) {
              current = current?.[parts[i]];
            }
            return current ?? '';
          }
        } else {
          current = current?.[part];
        }
      }

      return current ?? '';
    });
  }

  private topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
    // Simple topological sort based on edges
    const sorted: WorkflowNode[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        // Circular dependency detected
        return;
      }
      if (visited.has(nodeId)) {
        return;
      }

      visiting.add(nodeId);

      // Visit all dependencies first
      const incomingEdges = edges.filter((e) => e.target === nodeId);
      for (const edge of incomingEdges) {
        visit(edge.source);
      }

      visiting.delete(nodeId);
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        sorted.push(node);
      }
    };

    // Start with trigger nodes (no incoming edges)
    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    for (const triggerNode of triggerNodes) {
      visit(triggerNode.id);
    }

    // Visit remaining nodes
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        visit(node.id);
      }
    }

    return sorted;
  }
}


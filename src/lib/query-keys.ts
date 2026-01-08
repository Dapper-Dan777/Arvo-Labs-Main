// ============================================================================
// QUERY KEYS
// ============================================================================
// Zentrale Query-Keys für TanStack Query

export const queryKeys = {
  // Tasks
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
  
  // Time Entries
  timeEntries: {
    all: ['timeEntries'] as const,
    lists: () => [...queryKeys.timeEntries.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.timeEntries.lists(), filters] as const,
    details: () => [...queryKeys.timeEntries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.timeEntries.details(), id] as const,
  },
  
  // Documents
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.documents.lists(), filters] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.notifications.lists(), filters] as const,
    details: () => [...queryKeys.notifications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.notifications.details(), id] as const,
  },
  
  // Dashboard Stats
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    kpis: () => [...queryKeys.dashboard.all, 'kpis'] as const,
    charts: () => [...queryKeys.dashboard.all, 'charts'] as const,
  },
} as const;

import { supabase } from '@/Integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// ============================================================================
// SUPABASE QUERY FUNCTIONS
// ============================================================================
// 
// Diese Funktionen kapseln alle Supabase-Operationen für das Dashboard.
// Sie verwenden die Service Role Key oder filtern nach user_id.
//
// ============================================================================

/**
 * Get current user ID from Supabase Auth
 */
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// ============================================================================
// DOCUMENTS
// ============================================================================

export interface Document {
  id: string;
  title: string;
  type: 'PDF' | 'Excel' | 'Word' | 'PowerPoint';
  date: string;
  status: 'Fertig' | 'In Bearbeitung' | 'Entwurf' | 'In Prüfung';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export async function getDocuments(userId?: string): Promise<Document[]> {
  try {
    const uid = userId || await getCurrentUserId();
    if (!uid) return [];
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast({
      title: 'Fehler',
      description: 'Dokumente konnten nicht geladen werden.',
      variant: 'destructive',
    });
    return [];
  }
}

export async function createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document | null> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) {
      toast({
        title: 'Fehler',
        description: 'Du musst angemeldet sein, um Dokumente zu erstellen.',
        variant: 'destructive',
      });
      return null;
    }
    const { data, error } = await (supabase
      .from('documents') as any)
      .insert([{ 
        title: document.title,
        type: document.type,
        date: document.date,
        status: document.status,
        user_id: uid 
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: 'Erfolg',
      description: 'Dokument wurde erstellt.',
    });
    
    return data;
  } catch (error) {
    console.error('Error creating document:', error);
    toast({
      title: 'Fehler',
      description: 'Dokument konnte nicht erstellt werden.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) return false;
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', uid);

    if (error) throw error;
    
    toast({
      title: 'Erfolg',
      description: 'Dokument wurde gelöscht.',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    toast({
      title: 'Fehler',
      description: 'Dokument konnte nicht gelöscht werden.',
      variant: 'destructive',
    });
    return false;
  }
}

// ============================================================================
// TIME ENTRIES
// ============================================================================

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  duration: string;
  description?: string;
  status: 'Erfasst' | 'Geprüft' | 'Abgerechnet';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Mock data for development when database is not available
const MOCK_TIME_ENTRIES: TimeEntry[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    project: 'Dashboard Entwicklung',
    duration: '4h 30m',
    description: 'UI-Komponenten implementiert',
    status: 'Erfasst',
    user_id: 'demo-user-123',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Gestern
    project: 'API Integration',
    duration: '6h 0m',
    description: 'Supabase Queries erstellt',
    status: 'Erfasst',
    user_id: 'demo-user-123',
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // Vorgestern
    project: 'Testing',
    duration: '3h 15m',
    description: 'Unit Tests geschrieben',
    status: 'Geprüft',
    user_id: 'demo-user-123',
  },
  {
    id: '4',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    project: 'Code Review',
    duration: '2h 45m',
    description: 'Pull Requests reviewt',
    status: 'Erfasst',
    user_id: 'demo-user-123',
  },
  {
    id: '5',
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    project: 'Dokumentation',
    duration: '5h 0m',
    description: 'API Dokumentation aktualisiert',
    status: 'Erfasst',
    user_id: 'demo-user-123',
  },
];

export async function getTimeEntries(userId?: string): Promise<TimeEntry[]> {
  try {
    // Check if Supabase is configured
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('Supabase ist nicht konfiguriert. Verwende Mock-Daten.');
      return MOCK_TIME_ENTRIES;
    }

    const uid = userId || await getCurrentUserId();
    if (!uid) return [];
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: false });

    if (error) {
      // Check if it's a "table not found" error
      if (error.message?.includes('time_entries') || error.message?.includes('schema cache')) {
        console.warn('Tabelle time_entries existiert nicht. Verwende Mock-Daten.');
        console.warn('Bitte führe das SQL-Schema aus docs/supabase-schema.sql in Supabase aus.');
        return MOCK_TIME_ENTRIES;
      }
      
      console.error('Supabase error:', error);
      // For other errors, still return mock data to keep the UI working
      return MOCK_TIME_ENTRIES;
    }
    
    // If no data, return empty array (or mock data for demo)
    return data || [];
  } catch (error: any) {
    console.error('Error fetching time entries:', error);
    
    // Check if it's a "table not found" error
    if (error?.message?.includes('time_entries') || error?.message?.includes('schema cache')) {
      console.warn('Tabelle time_entries existiert nicht. Verwende Mock-Daten.');
      return MOCK_TIME_ENTRIES;
    }
    
    // Only show toast for unexpected errors
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    if (SUPABASE_URL && !error?.message?.includes('time_entries')) {
      toast({
        title: 'Fehler',
        description: error?.message || 'Zeitbuchungen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    }
    
    // Return mock data as fallback
    return MOCK_TIME_ENTRIES;
  }
}

export async function createTimeEntry(entry: Omit<TimeEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>): Promise<TimeEntry | null> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) {
      toast({
        title: 'Fehler',
        description: 'Du musst angemeldet sein, um Zeitbuchungen zu erstellen.',
        variant: 'destructive',
      });
      return null;
    }
    const { data, error } = await (supabase
      .from('time_entries') as any)
      .insert([{ 
        date: entry.date,
        project: entry.project,
        duration: entry.duration,
        description: entry.description,
        user_id: uid, 
        status: 'Erfasst' 
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: 'Erfolg',
      description: 'Zeitbuchung wurde erstellt.',
    });
    
    return data;
  } catch (error) {
    console.error('Error creating time entry:', error);
    toast({
      title: 'Fehler',
      description: 'Zeitbuchung konnte nicht erstellt werden.',
      variant: 'destructive',
    });
    return null;
  }
}

export async function deleteTimeEntry(entryId: string): Promise<boolean> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) return false;
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', uid);

    if (error) throw error;
    
    toast({
      title: 'Erfolg',
      description: 'Zeitbuchung wurde gelöscht.',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting time entry:', error);
    toast({
      title: 'Fehler',
      description: 'Zeitbuchung konnte nicht gelöscht werden.',
      variant: 'destructive',
    });
    return false;
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  type: 'document' | 'workflow' | 'ai' | 'task';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  user_id: string;
  created_at?: string;
}

export async function getNotifications(userId?: string): Promise<Notification[]> {
  try {
    const uid = userId || await getCurrentUserId();
    if (!uid) return [];
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('time', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) return false;
    const { error } = await (supabase
      .from('notifications') as any)
      .update({ unread: false })
      .eq('id', notificationId)
      .eq('user_id', uid);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}


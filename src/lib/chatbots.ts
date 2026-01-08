import { supabase, isSupabaseConfigured } from './supabaseClient';
import { setEncryptedObject, getEncryptedObject, removeEncryptedItem } from './crypto';

// Fallback: Lokaler Storage Key
const STORAGE_KEY = 'arvo_chatbots';

// Chatbot Interface
export interface Chatbot {
  id: string;
  owner_id: string;
  name: string;
  description?: string | null;
  chatbase_agent_id: string;
  config: ChatbotConfig;
  created_at: string;
  updated_at: string;
}

// Chatbot Config Interface
export interface ChatbotConfig {
  welcomeMessage?: string;
  customInstructions?: string;
  colors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
  branding?: {
    logoUrl?: string;
    companyName?: string;
  };
  // Botpress Integration
  botpressBotId?: string;
  botpressEmbedConfig?: {
    composerPlaceholder?: string;
    botName?: string;
    botAvatar?: string;
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any; // Für weitere Botpress-Konfigurationen
  };
}

// Input Interface für Create/Update
export interface ChatbotInput {
  name: string;
  description?: string;
  chatbase_agent_id: string;
  config?: ChatbotConfig;
}

/**
 * Lädt alle Chatbots für einen Benutzer
 */
export async function getChatbotsForUser(userId: string): Promise<Chatbot[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_chatbots')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chatbots from Supabase:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, Chatbot[]>>(STORAGE_KEY);
    return stored?.[userId] || [];
  } catch (error) {
    console.error('Error loading chatbots from local storage:', error);
    return [];
  }
}

/**
 * Lädt einen einzelnen Chatbot
 */
export async function getChatbotById(id: string, userId: string): Promise<Chatbot | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_chatbots')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (error) {
        console.error('Error fetching chatbot from Supabase:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, Chatbot[]>>(STORAGE_KEY);
    const chatbots = stored?.[userId] || [];
    return chatbots.find(bot => bot.id === id) || null;
  } catch (error) {
    console.error('Error loading chatbot from local storage:', error);
    return null;
  }
}

/**
 * Erstellt einen neuen Chatbot
 */
export async function createChatbot(userId: string, input: ChatbotInput): Promise<Chatbot> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_chatbots')
        .insert({
          owner_id: userId,
          name: input.name,
          description: input.description || null,
          chatbase_agent_id: input.chatbase_agent_id,
          config: input.config || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chatbot in Supabase:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  const newChatbot: Chatbot = {
    id: Date.now().toString(),
    owner_id: userId,
    name: input.name,
    description: input.description || null,
    chatbase_agent_id: input.chatbase_agent_id,
    config: input.config || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const stored = getEncryptedObject<Record<string, Chatbot[]>>(STORAGE_KEY) || {};
    stored[userId] = stored[userId] || [];
    stored[userId].unshift(newChatbot);
    setEncryptedObject(STORAGE_KEY, stored);
    return newChatbot;
  } catch (error) {
    console.error('Error saving chatbot to local storage:', error);
    throw error;
  }
}

/**
 * Aktualisiert einen Chatbot
 */
export async function updateChatbot(
  id: string,
  userId: string,
  input: Partial<ChatbotInput>
): Promise<Chatbot> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.chatbase_agent_id !== undefined) updateData.chatbase_agent_id = input.chatbase_agent_id;
      if (input.config !== undefined) updateData.config = input.config;

      const { data, error } = await supabase
        .from('user_chatbots')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating chatbot in Supabase:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, Chatbot[]>>(STORAGE_KEY) || {};
    const chatbots = stored[userId] || [];
    const index = chatbots.findIndex(bot => bot.id === id);
    
    if (index === -1) {
      throw new Error('Chatbot nicht gefunden');
    }

    const updatedChatbot: Chatbot = {
      ...chatbots[index],
      ...input,
      updated_at: new Date().toISOString(),
    };

    chatbots[index] = updatedChatbot;
    stored[userId] = chatbots;
    setEncryptedObject(STORAGE_KEY, stored);
    return updatedChatbot;
  } catch (error) {
    console.error('Error updating chatbot in local storage:', error);
    throw error;
  }
}

/**
 * Löscht einen Chatbot
 */
export async function deleteChatbot(id: string, userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('user_chatbots')
        .delete()
        .eq('id', id)
        .eq('owner_id', userId);

      if (error) {
        console.error('Error deleting chatbot from Supabase:', error);
        throw error;
      }

      return;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, Chatbot[]>>(STORAGE_KEY) || {};
    stored[userId] = (stored[userId] || []).filter(bot => bot.id !== id);
    setEncryptedObject(STORAGE_KEY, stored);
  } catch (error) {
    console.error('Error deleting chatbot from local storage:', error);
    throw error;
  }
}


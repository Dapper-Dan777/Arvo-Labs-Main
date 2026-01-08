import { supabase, isSupabaseConfigured, Customer, CustomerInput } from './supabaseClient';
import { setEncryptedObject, getEncryptedObject, removeEncryptedItem } from './crypto';

// Fallback: Lokaler Storage Key
const STORAGE_KEY = 'arvo_customers';

/**
 * Lädt alle Kunden für einen Benutzer
 * Nutzt Supabase wenn verfügbar, sonst lokalen Storage
 */
export async function getCustomersForUser(userId: string): Promise<Customer[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Sicherheit: RLS sorgt dafür, dass nur owner_id = auth.uid() die Datensätze sieht
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers from Supabase:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
      // Fallback zu lokalem Storage
    }
  }

  // Fallback: Lokaler Storage
  try {
    const stored = getEncryptedObject<Record<string, Customer[]>>(STORAGE_KEY);
    return stored?.[userId] || [];
  } catch (error) {
    console.error('Error loading customers from local storage:', error);
    return [];
  }
}

/**
 * Lädt einen einzelnen Kunden
 */
export async function getCustomerById(id: string, userId: string): Promise<Customer | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Kein Datensatz gefunden
          return null;
        }
        console.error('Error fetching customer from Supabase:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const customers = await getCustomersForUser(userId);
    return customers.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error loading customer from local storage:', error);
    return null;
  }
}

/**
 * Erstellt einen neuen Kunden
 */
export async function createCustomer(data: CustomerInput, userId: string): Promise<Customer> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Sicherheit: RLS sorgt dafür, dass nur owner_id = auth.uid() eingefügt werden kann
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          ...data,
          owner_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating customer in Supabase:', error);
        throw error;
      }

      return newCustomer;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const customers = await getCustomersForUser(userId);
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      owner_id: userId,
      company_name: data.company_name,
      contact_name: data.contact_name || null,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
      custom_fields: data.custom_fields || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    customers.unshift(newCustomer); // Am Anfang einfügen
    const stored = getEncryptedObject<Record<string, Customer[]>>(STORAGE_KEY) || {};
    stored[userId] = customers;
    setEncryptedObject(STORAGE_KEY, stored);

    return newCustomer;
  } catch (error) {
    console.error('Error creating customer in local storage:', error);
    throw error;
  }
}

/**
 * Aktualisiert einen bestehenden Kunden
 */
export async function updateCustomer(
  id: string,
  data: CustomerInput,
  userId: string
): Promise<Customer> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Sicherheit: RLS sorgt dafür, dass nur owner_id = auth.uid() aktualisiert werden kann
      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer in Supabase:', error);
        throw error;
      }

      return updatedCustomer;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const customers = await getCustomersForUser(userId);
    const index = customers.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Customer not found');
    }

    const updatedCustomer: Customer = {
      ...customers[index],
      ...data,
      custom_fields: data.custom_fields || null,
      updated_at: new Date().toISOString(),
    };

    customers[index] = updatedCustomer;
    const stored = getEncryptedObject<Record<string, Customer[]>>(STORAGE_KEY) || {};
    stored[userId] = customers;
    setEncryptedObject(STORAGE_KEY, stored);

    return updatedCustomer;
  } catch (error) {
    console.error('Error updating customer in local storage:', error);
    throw error;
  }
}

/**
 * Löscht einen Kunden
 */
export async function deleteCustomer(id: string, userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Sicherheit: RLS sorgt dafür, dass nur owner_id = auth.uid() gelöscht werden kann
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('owner_id', userId);

      if (error) {
        console.error('Error deleting customer from Supabase:', error);
        throw error;
      }

      return;
    } catch (error) {
      console.error('Supabase error, falling back to local storage:', error);
    }
  }

  // Fallback: Lokaler Storage
  try {
    const customers = await getCustomersForUser(userId);
    const filtered = customers.filter(c => c.id !== id);
    const stored = getEncryptedObject<Record<string, Customer[]>>(STORAGE_KEY) || {};
    stored[userId] = filtered;
    setEncryptedObject(STORAGE_KEY, stored);
  } catch (error) {
    console.error('Error deleting customer from local storage:', error);
    throw error;
  }
}


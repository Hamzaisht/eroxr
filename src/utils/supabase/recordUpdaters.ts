
import { supabase } from "@/integrations/supabase/client";
import { asColumnValue } from "./helpers";

/**
 * Safely update a database record with proper typing
 */
export async function updateRecord(
  table: string, 
  id: string, 
  updates: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', asColumnValue(id));
    
    return { success: !error, error };
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    return { success: false, error: err };
  }
}

/**
 * Safely update multiple database records with proper typing
 */
export async function updateRecords(
  table: string, 
  ids: string[], 
  updates: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from(table)
      .update(updates)
      .in('id', ids.map(id => asColumnValue(id)));
    
    return { success: !error, error };
  } catch (err) {
    console.error(`Error bulk updating ${table}:`, err);
    return { success: false, error: err };
  }
}

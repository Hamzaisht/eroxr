
import { supabase } from '@/integrations/supabase/client';

export const useDbService = () => {
  /**
   * Checks if a column exists in a specific table
   * @param table The table name
   * @param column The column name
   * @returns Promise<boolean> indicating if column exists
   */
  const checkColumnExists = async (table: string, column: string): Promise<boolean> => {
    try {
      // Simple check by selecting from the table with the column
      const { data, error } = await supabase
        .from(table)
        .select(column)
        .limit(1);

      if (error && error.message.includes(`column "${column}" does not exist`)) {
        console.log(`Column "${column}" does not exist in table "${table}"`);
        return false;
      }
      
      return true;
    } catch (err) {
      console.warn(`Error in checkColumnExists for ${column}:`, err);
      return false;
    }
  };

  return {
    checkColumnExists
  };
};

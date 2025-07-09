import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OptimisticAction<T> {
  id: string;
  type: 'update' | 'delete' | 'create';
  data: T;
  timestamp: number;
}

export const useOptimisticActions = <T>() => {
  const [pendingActions, setPendingActions] = useState<OptimisticAction<T>[]>([]);
  const { toast } = useToast();

  const addOptimisticAction = useCallback((action: Omit<OptimisticAction<T>, 'timestamp'>) => {
    const fullAction = { ...action, timestamp: Date.now() };
    setPendingActions(prev => [...prev, fullAction]);
    return fullAction;
  }, []);

  const removeOptimisticAction = useCallback((actionId: string) => {
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
  }, []);

  const performOptimisticUpdate = useCallback(async <R>(
    optimisticData: T,
    actualOperation: () => Promise<R>,
    successMessage: string,
    errorMessage: string,
    onSuccess?: (result: R) => void,
    onError?: (error: any) => void
  ): Promise<void> => {
    const actionId = `${Date.now()}-${Math.random()}`;
    
    // Add optimistic action
    addOptimisticAction({
      id: actionId,
      type: 'update',
      data: optimisticData
    });

    // Show immediate success
    toast({
      title: "Success!",
      description: successMessage,
    });

    try {
      // Perform actual operation
      const result = await actualOperation();
      
      // Remove optimistic action
      removeOptimisticAction(actionId);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      // Revert optimistic action
      removeOptimisticAction(actionId);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) {
        onError(error);
      }
    }
  }, [addOptimisticAction, removeOptimisticAction, toast]);

  const performOptimisticDelete = useCallback(async (
    itemId: string,
    actualOperation: () => Promise<void>,
    successMessage: string = "Item deleted successfully",
    errorMessage: string = "Failed to delete item"
  ): Promise<void> => {
    const actionId = `delete-${itemId}-${Date.now()}`;
    
    // Add optimistic delete action
    addOptimisticAction({
      id: actionId,
      type: 'delete',
      data: { id: itemId } as T
    });

    // Show immediate success
    toast({
      title: "Deleted!",
      description: successMessage,
    });

    try {
      // Perform actual deletion
      await actualOperation();
      
      // Remove optimistic action
      removeOptimisticAction(actionId);
    } catch (error) {
      // Revert optimistic action
      removeOptimisticAction(actionId);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [addOptimisticAction, removeOptimisticAction, toast]);

  return {
    pendingActions,
    performOptimisticUpdate,
    performOptimisticDelete,
    addOptimisticAction,
    removeOptimisticAction
  };
};
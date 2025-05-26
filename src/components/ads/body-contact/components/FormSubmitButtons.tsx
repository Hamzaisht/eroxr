
import { Button } from '@/components/ui/button';
import { FormSubmitButtonsProps } from '../types';

export const FormSubmitButtons = ({ isLoading, onCancel, onSubmit }: FormSubmitButtonsProps) => {
  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 bg-luxury-primary hover:bg-luxury-primary/90"
      >
        {isLoading ? 'Creating...' : 'Create Ad'}
      </Button>
    </div>
  );
};

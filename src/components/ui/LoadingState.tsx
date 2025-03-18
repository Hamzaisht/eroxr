
interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
      <div className="text-luxury-primary">{message}</div>
    </div>
  );
};

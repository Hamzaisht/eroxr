interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = "An error occurred" }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
      <div className="text-red-500">{message}</div>
    </div>
  );
};
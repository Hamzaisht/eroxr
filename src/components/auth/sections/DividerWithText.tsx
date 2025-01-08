export const DividerWithText = ({ text }: { text: string }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-luxury-primary/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-luxury-dark px-2 text-luxury-neutral/60">
          {text}
        </span>
      </div>
    </div>
  );
};
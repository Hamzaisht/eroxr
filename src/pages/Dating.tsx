
import { DatingContent } from "@/components/dating/DatingContent";

const Dating = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dating</h1>
        <p className="text-gray-400">Connect with amazing people around you</p>
      </div>
      <DatingContent />
    </div>
  );
};

export default Dating;

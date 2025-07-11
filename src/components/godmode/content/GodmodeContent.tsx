import React from 'react';

export const GodmodeContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-gray-400">Moderate and manage platform content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Content Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Posts</span>
              <span className="text-white font-semibold">45,678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Pending Review</span>
              <span className="text-yellow-400 font-semibold">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Flagged</span>
              <span className="text-red-400 font-semibold">5</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Media Overview</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Images: 12,345</div>
            <div className="text-sm text-gray-300">Videos: 3,456</div>
            <div className="text-sm text-gray-300">Storage: 2.3TB</div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Moderation Queue</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Review Flagged Content
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Auto-Moderation Rules
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Content Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

export const GodmodeMessages: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Message Management</h1>
        <p className="text-gray-400">Monitor and manage platform messaging</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Message Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Messages</span>
              <span className="text-white font-semibold">234,567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Today</span>
              <span className="text-green-400 font-semibold">2,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Reported</span>
              <span className="text-red-400 font-semibold">8</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Message Types</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Text: 89%</div>
            <div className="text-sm text-gray-300">Images: 8%</div>
            <div className="text-sm text-gray-300">Video: 3%</div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Moderation Tools</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Review Reports
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Message Filters
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded">
              Spam Detection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
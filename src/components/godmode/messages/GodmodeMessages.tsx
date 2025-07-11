import React, { useState } from 'react';
import { Search, MessageSquare, Eye, Download, AlertTriangle, Clock, DollarSign, Trash2 } from 'lucide-react';
import { FullscreenMediaViewer } from '@/components/media/FullscreenMediaViewer';
import { UniversalMediaRenderer } from '@/components/media/UniversalMediaRenderer';
import { MediaType } from '@/utils/media/types';

interface MessagePreview {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio';
    thumbnail?: string;
  };
  timestamp: string;
  isDeleted: boolean;
  isPPV: boolean;
  isDisappearing: boolean;
  isExpired: boolean;
  originalDuration?: number;
  ppvAmount?: number;
}

const mockMessages: MessagePreview[] = [
  {
    id: '1',
    sender: 'user123',
    recipient: 'creator456',
    content: 'Check out this exclusive content!',
    media: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'
    },
    timestamp: '2024-01-15 14:30',
    isDeleted: false,
    isPPV: true,
    isDisappearing: false,
    isExpired: false,
    ppvAmount: 25
  },
  {
    id: '2',
    sender: 'creator789',
    recipient: 'user123',
    content: 'Disappearing video message',
    media: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video'
    },
    timestamp: '2024-01-15 13:15',
    isDeleted: false,
    isPPV: false,
    isDisappearing: true,
    isExpired: true,
    originalDuration: 30
  },
  {
    id: '3',
    sender: 'user456',
    recipient: 'creator123',
    content: '[DELETED MESSAGE]',
    media: {
      url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400',
      type: 'image'
    },
    timestamp: '2024-01-15 12:00',
    isDeleted: true,
    isPPV: false,
    isDisappearing: false,
    isExpired: false
  }
];

export const GodmodeMessages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    alt: string;
  } | null>(null);
  const [hoveredMedia, setHoveredMedia] = useState<string | null>(null);

  const filteredMessages = mockMessages.filter(msg => 
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFullscreen = (media: { url: string; type: 'image' | 'video' | 'audio' }) => {
    if (media.type !== 'audio') {
      setFullscreenMedia({
        url: media.url,
        type: media.type as 'image' | 'video',
        alt: 'User generated content'
      });
    }
  };

  const MessageBadges = ({ message }: { message: MessagePreview }) => (
    <div className="flex gap-1 flex-wrap">
      {message.isDeleted && (
        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/30 rounded">
          <Trash2 className="w-3 h-3 inline mr-1" />
          Deleted
        </span>
      )}
      {message.isPPV && (
        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded">
          <DollarSign className="w-3 h-3 inline mr-1" />
          PPV ${message.ppvAmount}
        </span>
      )}
      {message.isDisappearing && (
        <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded">
          <Clock className="w-3 h-3 inline mr-1" />
          {message.isExpired ? 'Expired' : `${message.originalDuration}s`}
        </span>
      )}
    </div>
  );

  const MediaPreview = ({ message }: { message: MessagePreview }) => {
    if (!message.media) return null;

    return (
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredMedia(message.id)}
        onMouseLeave={() => setHoveredMedia(null)}
        onClick={() => openFullscreen(message.media!)}
      >
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
          {message.media.type === 'image' ? (
            <img
              src={message.media.thumbnail || message.media.url}
              alt="Message media"
              className="w-full h-full object-cover"
            />
          ) : message.media.type === 'video' ? (
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <video 
                src={message.media.url}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 text-xs">AUDIO</div>
            </div>
          )}
        </div>
        
        {hoveredMedia === message.id && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Message Management</h1>
        <p className="text-gray-400">Monitor and manage platform messaging including deleted, PPV, and disappearing content</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages, users, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <span className="text-gray-300">Deleted</span>
              <span className="text-red-400 font-semibold">1,234</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Media Content</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">Images: 45%</div>
            <div className="text-sm text-gray-300">Videos: 35%</div>
            <div className="text-sm text-gray-300">Audio: 20%</div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">PPV Content</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">PPV Messages</span>
              <span className="text-green-400 font-semibold">3,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Revenue</span>
              <span className="text-green-400 font-semibold">$12,345</span>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Disappearing</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Active</span>
              <span className="text-orange-400 font-semibold">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expired</span>
              <span className="text-gray-400 font-semibold">1,567</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">All Messages & UGC Content</h3>
          <p className="text-gray-400 text-sm">Complete message history including deleted, PPV, and expired content</p>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-white/5 transition-colors">
              <div className="flex gap-4">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 items-center">
                        <span className="text-white font-medium">{message.sender}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-300">{message.recipient}</span>
                        <span className="text-gray-500 text-sm">{message.timestamp}</span>
                      </div>
                      <MessageBadges message={message} />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <p className={`text-sm ${message.isDeleted ? 'text-red-400 italic' : 'text-gray-300'}`}>
                        {message.content}
                      </p>
                    </div>
                    
                    {message.media && (
                      <MediaPreview message={message} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Media Viewer */}
      {fullscreenMedia && (
        <FullscreenMediaViewer
          isOpen={!!fullscreenMedia}
          onClose={() => setFullscreenMedia(null)}
          mediaUrl={fullscreenMedia.url}
          mediaType={fullscreenMedia.type}
          alt={fullscreenMedia.alt}
        />
      )}
    </div>
  );
};
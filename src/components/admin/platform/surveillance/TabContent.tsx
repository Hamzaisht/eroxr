
import { useState } from "react";
import { LiveSession } from "./types";
import { useSurveillance } from "./SurveillanceContext";
import { SessionList } from "./SessionList";
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";

interface TabContentProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  activeTab?: string;
}

export const TabContent = ({ 
  sessions, 
  isLoading, 
  error,
  activeTab 
}: TabContentProps) => {
  const { handleStartSurveillance } = useSurveillance();
  const [filteredSessions, setFilteredSessions] = useState<LiveSession[]>(sessions);
  
  // Define type options based on the active tab
  const getTypeOptions = () => {
    switch (activeTab) {
      case 'streams':
        return [
          { value: 'all', label: 'All Streams' },
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'gaming', label: 'Gaming' },
          { value: 'performance', label: 'Performance' }
        ];
      case 'calls':
        return [
          { value: 'all', label: 'All Calls' },
          { value: 'video', label: 'Video Call' },
          { value: 'voice', label: 'Voice Call' },
          { value: 'group', label: 'Group Call' }
        ];
      case 'chats':
        return [
          { value: 'all', label: 'All Messages' },
          { value: 'text', label: 'Text' },
          { value: 'media', label: 'Media' },
          { value: 'video', label: 'Video' }
        ];
      case 'bodycontact':
        return [
          { value: 'all', label: 'All Ads' },
          { value: 'dating', label: 'Dating' },
          { value: 'casual', label: 'Casual' },
          { value: 'friendship', label: 'Friendship' }
        ];
      default:
        return [{ value: 'all', label: 'All Types' }];
    }
  };
  
  // Get status options based on active tab
  const getStatusOptions = () => {
    const commonOptions = [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ];
    
    if (activeTab === 'bodycontact') {
      return [
        ...commonOptions,
        { value: 'pending', label: 'Pending Review' },
        { value: 'flagged', label: 'Flagged' },
      ];
    }
    
    return commonOptions;
  };
  
  const handleSearch = (filters: SearchFilter) => {
    // Filter sessions based on the search criteria
    const filtered = sessions.filter(session => {
      // Filter by username/ID
      if (filters.username && !session.username?.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      if (filters.userId && session.user_id !== filters.userId) {
        return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'all' && session.status !== filters.status) {
        return false;
      }
      
      // Filter by content type
      if (filters.type && filters.type !== 'all' && session.content_type !== filters.type) {
        return false;
      }
      
      return true;
    });
    
    setFilteredSessions(filtered);
  };
  
  // When sessions prop updates, update filteredSessions
  if (sessions !== filteredSessions && !Object.keys(filteredSessions).length) {
    setFilteredSessions(sessions);
  }
  
  return (
    <div className="space-y-4">
      <SearchFilterBar 
        onSearch={handleSearch}
        placeholder={`Search ${activeTab}...`}
        availableTypes={getTypeOptions()}
        availableStatuses={getStatusOptions()}
      />
      
      <SessionList
        sessions={filteredSessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={handleStartSurveillance}
        activeTab={activeTab}
      />
    </div>
  );
};

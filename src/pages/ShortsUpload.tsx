
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoUploadForm } from '@/components/home/components/VideoUploadForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShortsUpload = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/shorts');
  };

  const handleCancel = () => {
    navigate('/shorts');
  };

  return (
    <div className="min-h-screen bg-luxury-darker">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/shorts')}
            className="text-luxury-neutral hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shorts
          </Button>
        </div>

        <VideoUploadForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ShortsUpload;

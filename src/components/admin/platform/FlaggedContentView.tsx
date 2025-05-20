
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ModerateContent } from './ModerateContent';

export const FlaggedContentView = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
          <CardDescription>
            Review and moderate content that has been flagged by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModerateContent />
        </CardContent>
      </Card>
    </div>
  );
};

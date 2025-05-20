
import React from "react";
import { UniversalMediaDemo } from "@/components/media/UniversalMediaDemo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Demo = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Demo Components</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Media Components Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Media Components</CardTitle>
            <CardDescription>
              Universal media handling capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UniversalMediaDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;

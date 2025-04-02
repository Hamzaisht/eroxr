
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/godmode/AdminHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModerateContent } from "@/components/admin/platform/ModerateContent";
import { FlaggedContent } from "@/components/admin/platform/FlaggedContent";

export default function Moderation() {
  return (
    <div className="space-y-4">
      <AdminHeader title="Content Moderation" section="Moderation" />
      
      <Tabs defaultValue="moderate">
        <TabsList>
          <TabsTrigger value="moderate">Moderation Panel</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>
        <TabsContent value="moderate">
          <ModerateContent />
        </TabsContent>
        <TabsContent value="flagged">
          <FlaggedContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

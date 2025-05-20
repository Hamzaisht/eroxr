
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Database } from '@/integrations/supabase/types/database.types';
import { isProfileRow, safeString } from '@/utils/supabase/typeSafeOperations';

// Define a type for profile data
type ProfileData = Database['public']['Tables']['profiles']['Row'];

export function TempDemoContent() {
  const [data, setData] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(10);

        if (error) {
          throw error;
        }

        if (profiles) {
          // Filter valid profiles and map to properly typed objects
          const typedProfiles = profiles
            .filter(isProfileRow)
            .map((profile) => ({
              id: safeString(profile.id),
              username: profile.username,
              avatar_url: profile.avatar_url,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              is_age_verified: profile.is_age_verified,
              date_of_birth: profile.date_of_birth,
              id_verification_status: profile.id_verification_status,
              bio: profile.bio,
              location: profile.location,
              interests: profile.interests,
              social_links: profile.social_links,
              profile_visibility: profile.profile_visibility,
              is_paying_customer: profile.is_paying_customer,
              banner_url: profile.banner_url,
              first_name: profile.first_name,
              last_name: profile.last_name,
              is_suspended: profile.is_suspended,
              suspended_at: profile.suspended_at,
              status: profile.status
            }));
          setData(typedProfiles);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Temporary Demo Content</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item?.username || 'No Username'}</CardTitle>
                <CardDescription>{item?.id || 'No Email'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>ID: {String(item?.id) || 'Unknown'}</p>
                <p>Created At: {item?.created_at || 'No Creation Date'}</p>
              </CardContent>
              <CardFooter>
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

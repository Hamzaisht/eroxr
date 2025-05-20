
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
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Database } from '@/integrations/supabase/types/database.types';

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

        // Safely transform the data
        if (profiles) {
          const safeProfiles = profiles as ProfileData[];
          setData(safeProfiles);
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
                <p>ID: {item?.id || 'Unknown'}</p>
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

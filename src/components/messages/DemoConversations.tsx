import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DemoConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const createDemoData = async () => {
      try {
        // Check if demo data already exists
        const { data: existingMessages } = await supabase
          .from('direct_messages')
          .select('id')
          .eq('sender_id', user.id)
          .limit(1);

        if (existingMessages && existingMessages.length > 0) return;

        // Create demo profiles if they don't exist
        const demoUsers = [
          { id: '550e8400-e29b-41d4-a716-446655440001', username: 'alice_wonder', avatar_url: null },
          { id: '550e8400-e29b-41d4-a716-446655440002', username: 'bob_builder', avatar_url: null },
          { id: '550e8400-e29b-41d4-a716-446655440003', username: 'charlie_brown', avatar_url: null }
        ];

        for (const demoUser of demoUsers) {
          await supabase
            .from('profiles')
            .upsert(demoUser, { onConflict: 'id' });
        }

        // Create demo messages
        const demoMessages = [
          {
            sender_id: demoUsers[0].id,
            recipient_id: user.id,
            content: "Hey! How's it going? 👋",
            message_type: 'text',
            created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            sender_id: user.id,
            recipient_id: demoUsers[0].id,
            content: "Pretty good! Just checking out this new messaging feature",
            message_type: 'text',
            created_at: new Date(Date.now() - 3300000).toISOString() // 55 min ago
          },
          {
            sender_id: demoUsers[1].id,
            recipient_id: user.id,
            content: "Want to chat about the new project? 🚀",
            message_type: 'text',
            created_at: new Date(Date.now() - 1800000).toISOString() // 30 min ago
          },
          {
            sender_id: demoUsers[2].id,
            recipient_id: user.id,
            content: "Thanks for the help earlier! Really appreciate it 🙏",
            message_type: 'text',
            created_at: new Date(Date.now() - 900000).toISOString() // 15 min ago
          }
        ];

        for (const message of demoMessages) {
          await supabase
            .from('direct_messages')
            .insert(message);
        }

        toast({
          title: "Demo conversations created!",
          description: "You now have some example conversations to explore"
        });

      } catch (error) {
        console.error('Error creating demo data:', error);
      }
    };

    // Only create demo data once per user
    const hasCreatedDemo = localStorage.getItem(`demo_created_${user.id}`);
    if (!hasCreatedDemo) {
      createDemoData();
      localStorage.setItem(`demo_created_${user.id}`, 'true');
    }
  }, [user?.id, toast]);

  return null; // This is just a background utility component
};
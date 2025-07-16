import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-end';
  callId: string;
  data: any;
  senderId: string;
  recipientId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let callId: string | null = null;
  let userId: string | null = null;

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = async (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log('Received signaling message:', message.type);

      // Store connection info
      if (!callId) callId = message.callId;
      if (!userId) userId = message.senderId;

      // Handle different message types
      switch (message.type) {
        case 'offer':
          // Forward offer to recipient
          await forwardSignalingMessage(message);
          break;
          
        case 'answer':
          // Forward answer to caller
          await forwardSignalingMessage(message);
          break;
          
        case 'ice-candidate':
          // Forward ICE candidate to peer
          await forwardSignalingMessage(message);
          break;
          
        case 'call-end':
          // Update call status in database
          if (callId) {
            await supabase
              .from('call_history')
              .update({
                status: 'ended',
                ended_at: new Date().toISOString()
              })
              .eq('id', callId);
          }
          await forwardSignalingMessage(message);
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  };

  socket.onclose = async () => {
    console.log('WebSocket connection closed');
    
    // Update call status if connection was lost unexpectedly
    if (callId) {
      await supabase
        .from('call_history')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', callId)
        .eq('status', 'connected'); // Only update if call was connected
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Function to forward signaling messages using Supabase realtime
  async function forwardSignalingMessage(message: SignalingMessage) {
    try {
      // Use Supabase realtime to broadcast the message
      const channel = supabase.channel(`call:${message.callId}`);
      
      await channel.send({
        type: 'broadcast',
        event: message.type,
        payload: {
          ...message.data,
          senderId: message.senderId,
          recipientId: message.recipientId,
          callId: message.callId
        }
      });

      console.log(`Forwarded ${message.type} message for call ${message.callId}`);
    } catch (error) {
      console.error('Error forwarding signaling message:', error);
    }
  }

  return response;
});
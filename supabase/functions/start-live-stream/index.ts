import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { title, isPrivate } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique stream key and URLs
    const streamKey = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const rtmpUrl = `rtmp://ingest.example.com/live`;
    const playbackUrl = `https://stream.example.com/live/${streamKey}/index.m3u8`;

    // Create live stream record
    const { data: stream, error: streamError } = await supabaseClient
      .from('live_streams')
      .insert([
        {
          creator_id: user.id,
          title,
          is_private: isPrivate || false,
          status: 'live',
          stream_key: streamKey,
          playback_url: playbackUrl,
          started_at: new Date().toISOString(),
          viewer_count: 0
        }
      ])
      .select()
      .single();

    if (streamError) {
      console.error('Stream creation error:', streamError);
      return new Response(
        JSON.stringify({ error: 'Failed to create stream' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return stream details including RTMP configuration
    return new Response(
      JSON.stringify({
        success: true,
        stream: {
          id: stream.id,
          streamKey,
          rtmpUrl,
          playbackUrl,
          rtmpIngestUrl: `${rtmpUrl}/${streamKey}`,
          title: stream.title,
          status: stream.status,
          instructions: {
            obs: {
              server: rtmpUrl,
              streamKey: streamKey
            },
            directRtmp: `${rtmpUrl}/${streamKey}`
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ViewTrackingRequest {
  contentId: string;
  contentType: 'post' | 'video' | 'dating_ad' | 'profile' | 'story';
  viewerFingerprint?: string;
  userId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 View tracking request received');

    // Get request data
    const { contentId, contentType, viewerFingerprint, userId }: ViewTrackingRequest = await req.json();
    
    if (!contentId || !contentType) {
      console.error('❌ Missing required fields:', { contentId, contentType });
      return new Response(
        JSON.stringify({ error: 'Missing contentId or contentType' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP for additional tracking
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Create device fingerprint if not provided
    const userAgent = req.headers.get('user-agent') || '';
    const acceptLanguage = req.headers.get('accept-language') || '';
    const finalFingerprint = viewerFingerprint || 
      `${clientIP}_${btoa(userAgent + acceptLanguage).substring(0, 20)}`;

    console.log('📊 Tracking view:', {
      contentId,
      contentType,
      fingerprint: finalFingerprint,
      userId,
      ip: clientIP
    });

    // Check if view already exists in current hour
    const currentHour = new Date();
    currentHour.setMinutes(0, 0, 0); // Start of current hour
    const nextHour = new Date(currentHour.getTime() + 60 * 60 * 1000); // Next hour

    const { data: existingView } = await supabase
      .from('view_tracking')
      .select('id')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .eq('viewer_fingerprint', finalFingerprint)
      .gte('viewed_at', currentHour.toISOString())
      .lt('viewed_at', nextHour.toISOString())
      .single();

    if (existingView) {
      console.log('⏰ View already tracked in current hour - skipping');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'View already tracked this hour',
          tracked: false,
          cooldownUntil: nextHour.toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert new view tracking record
    const { error: insertError } = await supabase
      .from('view_tracking')
      .insert({
        content_id: contentId,
        content_type: contentType,
        viewer_fingerprint: finalFingerprint,
        viewer_ip: clientIP,
        user_id: userId || null,
      });

    if (insertError) {
      console.error('❌ Failed to insert view tracking:', insertError);
      // If it's a unique constraint violation, it means another request just inserted it
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'View already tracked by concurrent request',
            tracked: false 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      throw insertError;
    }

    // Update the actual content view count
    let updateError: any = null;
    
    switch (contentType) {
      case 'post':
        const { error: postError } = await supabase.rpc('increment_counter', {
          row_id: contentId,
          counter_name: 'view_count',
          table_name: 'posts'
        });
        updateError = postError;
        break;
        
      case 'video':
        const { error: videoError } = await supabase.rpc('increment_counter', {
          row_id: contentId,
          counter_name: 'view_count', 
          table_name: 'videos'
        });
        updateError = videoError;
        break;
        
      case 'dating_ad':
        const { error: adError } = await supabase.rpc('increment_counter', {
          row_id: contentId,
          counter_name: 'view_count',
          table_name: 'dating_ads'
        });
        updateError = adError;
        break;
        
      case 'story':
        const { error: storyError } = await supabase.rpc('increment_counter', {
          row_id: contentId,
          counter_name: 'view_count',
          table_name: 'stories'
        });
        updateError = storyError;
        break;
    }

    if (updateError) {
      console.error('❌ Failed to update content view count:', updateError);
      // Don't fail the request if content update fails
    }

    console.log('✅ View tracked successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'View tracked successfully',
        tracked: true,
        nextAllowedView: nextHour.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ View tracking error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
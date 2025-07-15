
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get customer
    const { data: customer } = await supabaseClient
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!customer) {
      // No customer = no subscription
      await supabaseClient.from("platform_subscriptions").upsert({
        user_id: user.id,
        status: "inactive",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      return new Response(JSON.stringify({
        hasPremium: false,
        status: "inactive",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
      status: "active",
    });

    const platformSubscription = subscriptions.data.find(sub => 
      sub.metadata?.subscription_type === "platform_premium"
    );

    let hasPremium = false;
    let subscriptionData = {
      status: "inactive",
      current_period_start: null,
      current_period_end: null,
      stripe_subscription_id: null,
    };

    if (platformSubscription) {
      hasPremium = true;
      subscriptionData = {
        status: "active",
        current_period_start: new Date(platformSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(platformSubscription.current_period_end * 1000).toISOString(),
        stripe_subscription_id: platformSubscription.id,
      };
    }

    // Update database
    await supabaseClient.from("platform_subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customer.stripe_customer_id,
      ...subscriptionData,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    return new Response(JSON.stringify({
      hasPremium,
      status: subscriptionData.status,
      currentPeriodEnd: subscriptionData.current_period_end,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking platform subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

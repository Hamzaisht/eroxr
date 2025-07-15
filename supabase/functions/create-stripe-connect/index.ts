
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-CONNECT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if user already has a Stripe Connect account
    const { data: existingAccount } = await supabaseClient
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingAccount && existingAccount.onboarding_completed) {
      return new Response(JSON.stringify({ 
        account_id: existingAccount.stripe_account_id,
        onboarding_completed: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let accountId = existingAccount?.stripe_account_id;

    // Create new Stripe Connect account if none exists
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
      });

      accountId = account.id;
      logStep("Stripe Connect account created", { accountId });

      // Save to database
      await supabaseClient
        .from('stripe_accounts')
        .upsert({
          user_id: user.id,
          stripe_account_id: accountId,
          account_enabled: false,
          onboarding_completed: false,
          capabilities_card_payments: 'inactive',
          capabilities_transfers: 'inactive',
          country: 'US',
          default_currency: 'usd',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${req.headers.get("origin")}/profile?stripe_refresh=true`,
      return_url: `${req.headers.get("origin")}/profile?stripe_success=true`,
      type: 'account_onboarding',
    });

    logStep("Account link created", { url: accountLink.url });

    return new Response(JSON.stringify({ 
      url: accountLink.url,
      account_id: accountId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-stripe-connect", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOKS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // For now, we'll parse the event without signature verification
    // In production, you should verify the webhook signature
    const event = JSON.parse(body);
    logStep("Event parsed", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabaseClient);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, supabaseClient);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabaseClient);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabaseClient);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object, supabaseClient);
        break;
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhooks", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleCheckoutCompleted(session: any, supabase: any) {
  logStep("Processing checkout completion", { sessionId: session.id });

  if (session.mode === 'payment' && session.metadata?.type === 'ppv_purchase') {
    // Handle PPV purchase
    const { error } = await supabase
      .from('post_purchases')
      .insert({
        post_id: session.metadata.post_id,
        user_id: session.metadata.user_id,
        amount: parseFloat(session.metadata.amount),
        created_at: new Date().toISOString()
      });

    if (error) {
      logStep("Error inserting PPV purchase", { error });
    } else {
      logStep("PPV purchase recorded successfully");
    }
  }
}

async function handleSubscriptionCreated(subscription: any, supabase: any) {
  logStep("Processing subscription creation", { subscriptionId: subscription.id });

  // Extract metadata from the subscription or customer
  const customer = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (customer.data) {
    const { error } = await supabase
      .from('creator_subscriptions')
      .insert({
        user_id: customer.data.user_id,
        creator_id: subscription.metadata?.creator_id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) {
      logStep("Error inserting subscription", { error });
    } else {
      logStep("Subscription recorded successfully");
    }
  }
}

async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  logStep("Processing subscription update", { subscriptionId: subscription.id });

  const { error } = await supabase
    .from('creator_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    logStep("Error updating subscription", { error });
  } else {
    logStep("Subscription updated successfully");
  }
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  logStep("Processing subscription deletion", { subscriptionId: subscription.id });

  const { error } = await supabase
    .from('creator_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    logStep("Error canceling subscription", { error });
  } else {
    logStep("Subscription canceled successfully");
  }
}

async function handlePaymentSucceeded(paymentIntent: any, supabase: any) {
  logStep("Processing successful payment", { paymentIntentId: paymentIntent.id });
  // Handle any additional payment success logic here
}

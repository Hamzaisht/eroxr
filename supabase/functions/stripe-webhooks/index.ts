
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

    // Verify webhook signature for security
    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook verified", { type: event.type, id: event.id });
      } catch (err: any) {
        logStep("Webhook signature verification failed", { error: err.message });
        return new Response(`Webhook signature verification failed: ${err.message}`, {
          status: 400,
        });
      }
    } else {
      // Fallback for development - remove in production
      event = JSON.parse(body);
      logStep("Event parsed (unverified)", { type: event.type, id: event.id });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabaseClient, stripe);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object, supabaseClient, stripe);
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

async function handleCheckoutCompleted(session: any, supabase: any, stripe: any) {
  logStep("Processing checkout completion", { sessionId: session.id, mode: session.mode });

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
  } else if (session.mode === 'subscription') {
    // Handle platform subscription checkout completion
    if (session.metadata?.subscription_type === 'platform_premium') {
      await handlePlatformSubscriptionCheckout(session, supabase, stripe);
    } else {
      // Handle creator subscription checkout
      await handleCreatorSubscriptionCheckout(session, supabase, stripe);
    }
  }
}

async function handleSubscriptionCreated(subscription: any, supabase: any) {
  logStep("Processing subscription creation", { subscriptionId: subscription.id });

  if (subscription.metadata?.subscription_type === 'platform_premium') {
    await updatePlatformSubscriptionFromStripe(subscription, supabase);
  } else {
    await updateCreatorSubscriptionFromStripe(subscription, supabase);
  }
}

async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  logStep("Processing subscription update", { subscriptionId: subscription.id });

  if (subscription.metadata?.subscription_type === 'platform_premium') {
    await updatePlatformSubscriptionFromStripe(subscription, supabase);
  } else {
    // Update creator subscription
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
      logStep("Error updating creator subscription", { error });
    } else {
      logStep("Creator subscription updated successfully");
    }
  }
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  logStep("Processing subscription deletion", { subscriptionId: subscription.id });

  if (subscription.metadata?.subscription_type === 'platform_premium') {
    // Update platform subscription status
    const { error } = await supabase
      .from('platform_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logStep("Error canceling platform subscription", { error });
    } else {
      logStep("Platform subscription canceled successfully");
    }
  } else {
    // Update creator subscription status
    const { error } = await supabase
      .from('creator_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logStep("Error canceling creator subscription", { error });
    } else {
      logStep("Creator subscription canceled successfully");
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: any, supabase: any) {
  logStep("Processing successful payment", { paymentIntentId: paymentIntent.id });
  // Handle any additional payment success logic here
}

async function handleInvoicePaid(invoice: any, supabase: any, stripe: any) {
  logStep("Processing invoice paid", { invoiceId: invoice.id, subscriptionId: invoice.subscription });

  if (!invoice.subscription) return;

  try {
    // Get the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    if (subscription.metadata?.subscription_type === 'platform_premium') {
      // Update platform subscription
      await updatePlatformSubscriptionFromStripe(subscription, supabase);
    } else {
      // Update creator subscription
      await updateCreatorSubscriptionFromStripe(subscription, supabase);
    }
  } catch (error) {
    logStep("Error processing invoice payment", { error });
  }
}

async function handlePlatformSubscriptionCheckout(session: any, supabase: any, stripe: any) {
  logStep("Processing platform subscription checkout", { sessionId: session.id });

  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await updatePlatformSubscriptionFromStripe(subscription, supabase);
    logStep("Platform subscription created successfully");
  } catch (error) {
    logStep("Error processing platform subscription checkout", { error });
  }
}

async function handleCreatorSubscriptionCheckout(session: any, supabase: any, stripe: any) {
  logStep("Processing creator subscription checkout", { sessionId: session.id });

  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await updateCreatorSubscriptionFromStripe(subscription, supabase);
    logStep("Creator subscription created successfully");
  } catch (error) {
    logStep("Error processing creator subscription checkout", { error });
  }
}

async function updatePlatformSubscriptionFromStripe(subscription: any, supabase: any) {
  // Get customer to find user_id
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (!customer?.user_id) {
    logStep("Customer not found for platform subscription", { customerId: subscription.customer });
    return;
  }

  const subscriptionData = {
    user_id: customer.user_id,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('platform_subscriptions')
    .upsert(subscriptionData, { onConflict: 'user_id' });

  if (error) {
    logStep("Error updating platform subscription", { error });
  } else {
    logStep("Platform subscription updated successfully", { userId: customer.user_id });
  }
}

async function updateCreatorSubscriptionFromStripe(subscription: any, supabase: any) {
  // Get customer to find user_id
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (!customer?.user_id) {
    logStep("Customer not found for creator subscription", { customerId: subscription.customer });
    return;
  }

  const { error } = await supabase
    .from('creator_subscriptions')
    .upsert({
      user_id: customer.user_id,
      creator_id: subscription.metadata?.creator_id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'stripe_subscription_id' });

  if (error) {
    logStep("Error updating creator subscription", { error });
  } else {
    logStep("Creator subscription updated successfully");
  }
}

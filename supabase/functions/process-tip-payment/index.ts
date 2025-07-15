
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
    const { recipientId, amount, message } = await req.json();
    
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

    // Get or create customer
    let customerId;
    const { data: existingCustomer } = await supabaseClient
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      await supabaseClient.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: customerId,
        email: user.email!,
      });
    }

    // Calculate platform fee (7%)
    const totalAmount = Math.round(amount * 100); // Convert to øre
    const platformFee = Math.round(totalAmount * 0.07);
    const creatorAmount = totalAmount - platformFee;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "sek",
      customer: customerId,
      metadata: {
        user_id: user.id,
        recipient_id: recipientId,
        type: "tip",
        platform_fee: platformFee.toString(),
        creator_amount: creatorAmount.toString(),
      },
      application_fee_amount: platformFee,
    });

    // Store tip in database
    const { data: tipData, error: tipError } = await supabaseClient
      .from("tips")
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        amount: amount,
        message: message || null,
        stripe_payment_intent_id: paymentIntent.id,
        platform_fee_amount: platformFee / 100,
        creator_amount: creatorAmount / 100,
        status: "pending",
      })
      .select()
      .single();

    if (tipError) {
      throw new Error(`Database error: ${tipError.message}`);
    }

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      tipId: tipData.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing tip payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

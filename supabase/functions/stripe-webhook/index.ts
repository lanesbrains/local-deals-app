import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

serve(async (req) => {
  try {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();
    
    if (!sig) {
      throw new Error('No Stripe signature found');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const { user_id, plan_type, business_id } = session.metadata || {};
        
        if (!user_id) {
          console.error('No user_id in session metadata');
          break;
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // Insert subscription record
        const { error: subError } = await supabase.from('subscriptions').insert({
          user_id,
          business_id: business_id || null,
          stripe_subscription_id: subscription.id,
          plan_type: plan_type || 'newsletter',
          status: subscription.status,
        });

        if (subError) {
          console.error('Error inserting subscription:', subError);
        } else {
          console.log(`Subscription created for user ${user_id}`);
        }

        // If it's a business subscription, activate the business
        if (business_id && plan_type?.includes('business')) {
          const { error: bizError } = await supabase
            .from('businesses')
            .update({ 
              is_premium: plan_type === 'business_premium',
              is_free_tier: false 
            })
            .eq('id', business_id);

          if (bizError) {
            console.error('Error updating business:', bizError);
          }
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const updatedSubscription = event.data.object;
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ status: updatedSubscription.status })
          .eq('stripe_subscription_id', updatedSubscription.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
        } else {
          console.log(`Subscription ${updatedSubscription.id} updated to ${updatedSubscription.status}`);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
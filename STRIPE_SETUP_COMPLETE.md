# 💳 Complete Stripe Integration Setup

## Current Status

✅ You have valid Stripe test keys configured
✅ Webhook endpoint is coded
✅ Checkout function is ready

## Missing Steps to Complete Integration

### 1. Create Products in Stripe Dashboard

Go to your Stripe Dashboard → Products and create these products:

#### Newsletter Subscription

- **Name**: PNW Deals Newsletter
- **Description**: Weekly newsletter with personalized local deals
- **Price**: $1.00 USD / month
- **Billing**: Recurring monthly
- **Price ID**: Copy this and update your code (currently using `price_newsletter_1month`)

#### Business Directory - Standard

- **Name**: PNW Deals Business Directory - Standard
- **Description**: Standard business listing in PNW Deals directory
- **Price**: $5.00 USD / month
- **Billing**: Recurring monthly
- **Price ID**: Copy this (currently using `price_business_standard_1month`)

#### Business Directory - Premium

- **Name**: PNW Deals Business Directory - Premium
- **Description**: Premium business listing with featured placement
- **Price**: $10.00 USD / month
- **Billing**: Recurring monthly
- **Price ID**: Copy this (currently using `price_business_premium_1month`)

### 2. Set Up Webhook Endpoint

1. Go to Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://abynqzmdfxdyjsxekphd.supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the webhook signing secret and update your `.env` file (you already have this)

### 3. Update Price IDs in Code

Once you create the products, update these files with the real price IDs:

```javascript
// In pages/index.vue (newsletter signup)
price_id: "price_1234567890abcdef", // Replace with actual newsletter price ID

// In pages/business-signup.vue (business signup)
const priceId = isPremium.value ? 'price_premium_real_id' : 'price_standard_real_id';
```

### 4. Test the Complete Flow

Here's what should happen:

1. **User Signs Up**:
   - Fills out form with email and categories
   - Supabase creates user account
   - Categories are saved to user_categories/user_subcategories
   - Stripe checkout session is created
   - User is redirected to check-email page
   - User confirms email
   - User completes Stripe payment
   - Webhook updates subscription status
   - User receives welcome email

2. **Business Signs Up**:
   - Fills out business form
   - Supabase creates user and business records
   - Stripe checkout session is created
   - User completes payment
   - Webhook activates business listing
   - Business can log in to manage deals

## Free Tier Implementation (Recommended)

Since you mentioned not wanting to charge at first, here's how to implement a free tier:

### Option 1: Free Trial Period

```javascript
// In Stripe product setup, add a free trial
// 30-day free trial, then $1/month

// In your checkout session creation:
const session = await stripe.checkout.sessions.create({
  // ... other options
  subscription_data: {
    trial_period_days: 30, // 30 days free
  },
});
```

### Option 2: Completely Free for First X Users

```javascript
// In your signup flow, check user count first
const { count } = await supabase
  .from("users")
  .select("*", { count: "exact", head: true });

if (count < 100) {
  // First 100 users are free - skip Stripe
  await supabase.from("subscriptions").insert({
    user_id: authData.user.id,
    plan_type: "newsletter",
    status: "active",
    stripe_subscription_id: "free_tier_" + Date.now(),
  });

  // Redirect directly to success page
  await navigateTo("/success");
} else {
  // Regular Stripe flow for users 101+
  // ... existing Stripe code
}
```

### Option 3: Freemium Model

```javascript
// Offer both free and paid tiers
const FREE_FEATURES = {
  newsletter: true,
  deals_per_week: 3,
  categories: 2,
};

const PAID_FEATURES = {
  newsletter: true,
  deals_per_week: "unlimited",
  categories: "unlimited",
  early_access: true,
  exclusive_deals: true,
};
```

## Testing Stripe Integration

### Test Cards (Use in Stripe test mode):

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Checklist:

- [ ] Newsletter signup creates Stripe session
- [ ] Business signup creates Stripe session
- [ ] Successful payment triggers webhook
- [ ] Webhook updates database correctly
- [ ] Failed payment is handled gracefully
- [ ] Subscription cancellation works
- [ ] User can access their subscription status

## Webhook Testing

Test your webhook locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local development
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Test webhook with sample event
stripe trigger checkout.session.completed
```

## Production Deployment

When ready for production:

1. **Switch to Live Keys**:
   - Get live Stripe keys from dashboard
   - Update webhook endpoint to production URL
   - Update `.env` with live keys

2. **Update Webhook URL**:
   - Change from test webhook to production webhook
   - URL: `https://your-domain.com/api/stripe-webhook`

3. **Test in Production**:
   - Use real credit card (small amount)
   - Verify webhook receives events
   - Check database updates correctly

## Current Integration Status

Based on your code, here's what's working and what needs attention:

### ✅ Working:

- Stripe keys are configured
- Checkout session creation code exists
- Webhook handler is implemented
- Database schema supports subscriptions

### ⚠️ Needs Attention:

- Price IDs need to be updated with real Stripe product IDs
- Webhook endpoint needs to be registered in Stripe dashboard
- Free tier logic needs to be implemented
- Error handling for failed payments
- Subscription management UI for users

### ❌ Missing:

- Products created in Stripe dashboard
- Webhook endpoint registered
- Testing of complete payment flow
- User subscription status display
- Cancellation/upgrade flows

## Recommended Next Steps

1. **Create Stripe products** (5 minutes)
2. **Register webhook endpoint** (2 minutes)
3. **Update price IDs in code** (3 minutes)
4. **Test complete flow** (10 minutes)
5. **Implement free tier** (optional, 15 minutes)

Once these steps are complete, you'll have a fully functional payment system! 🎉

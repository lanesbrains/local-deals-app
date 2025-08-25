# 📧 Resend Email Service Setup Guide

## Overview

This guide will help you set up Resend for sending newsletters and transactional emails in your PNW Deals app.

## 🚀 Quick Setup

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key

1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it "PNW Deals Production"
4. Copy the API key (starts with `re_`)
5. Add to your `.env` file:
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### Step 3: Add Your Domain (Optional but Recommended)

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `pnwdeals.com`)
4. Add the DNS records they provide
5. Wait for verification (usually 5-10 minutes)

### Step 4: Update Email Addresses

Once your domain is verified, update the "from" address in your newsletter script:

```javascript
// In scripts/send-newsletter.js, change this line:
from: "PNW Deals <deals@pnwdeals.local>",
// To your actual domain:
from: "PNW Deals <deals@yourdomain.com>",
```

## 📊 Resend Free Tier Limits

- **3,000 emails/month** for free
- **100 emails/day** for free
- Perfect for starting out!

## 🧪 Testing Email Delivery

### Test Newsletter Script

```bash
# Test the newsletter system
node scripts/send-newsletter.js
```

### Test Individual Email

Create a test script to verify Resend is working:

```javascript
// test-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "PNW Deals <deals@yourdomain.com>",
      to: ["your-email@example.com"],
      subject: "Test Email from PNW Deals",
      html: "<h1>Hello from PNW Deals!</h1><p>If you receive this, Resend is working correctly.</p>",
    });

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Success:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testEmail();
```

## 🔧 Newsletter Flow Verification

### Current Flow:

1. **User Signs Up** → Creates user record with category preferences
2. **Business Creates Deal** → Deal stored in database with business_id
3. **Weekly Newsletter Runs** → Filters deals by user preferences and sends via Resend
4. **Stripe Webhook** → Updates subscription status when payment succeeds

### Verification Checklist:

- [ ] Resend API key is configured
- [ ] Newsletter script runs without errors
- [ ] Deals are being created by businesses
- [ ] Users receive emails with relevant deals only
- [ ] Unsubscribe links work
- [ ] Email formatting looks good on mobile

## 📈 Monitoring & Analytics

### Resend Dashboard Metrics:

- **Delivery Rate**: Should be >95%
- **Open Rate**: Aim for >20% (industry average)
- **Click Rate**: Aim for >2%
- **Bounce Rate**: Should be <5%

### Email Best Practices:

1. **Subject Lines**: Keep under 50 characters
2. **From Name**: Use consistent "PNW Deals" branding
3. **Content**: Mobile-first design, clear CTAs
4. **Frequency**: Weekly is perfect (not too spammy)
5. **Personalization**: Filter by user preferences (already implemented)

## 🚨 Troubleshooting

### Common Issues:

**1. "API key not found" error**

- Check `.env` file has correct `RESEND_API_KEY`
- Restart your development server after adding the key

**2. "Domain not verified" error**

- Use `@resend.dev` domain for testing
- Or verify your custom domain in Resend dashboard

**3. Emails going to spam**

- Add SPF, DKIM, and DMARC records (Resend provides these)
- Use a consistent "from" address
- Avoid spam trigger words in subject lines

**4. Newsletter not sending**

- Check if there are active subscribers in database
- Verify deals exist from the past 7 days
- Check console logs for errors

### Debug Commands:

```bash
# Check database for subscribers
npm run check-db

# Test newsletter with verbose logging
DEBUG=true node scripts/send-newsletter.js

# Test Resend API connection
node test-email.js
```

## 🎯 Production Deployment

### Environment Variables for Production:

```env
# Production Resend setup
RESEND_API_KEY=re_your_production_api_key
APP_URL=https://yourdomain.com

# Update newsletter "from" address
# In scripts/send-newsletter.js:
from: "PNW Deals <deals@yourdomain.com>"
```

### Netlify Scheduled Function:

Your `netlify.toml` already has the scheduled function configured:

```toml
[[scheduled]]
  function = "send-deal-notifications"
  cron = "0 9 * * 1"  # Every Monday at 9 AM UTC
```

This will automatically run your newsletter every week!

## 📧 Email Templates

### Current Newsletter Template Features:

- ✅ Responsive design (mobile-friendly)
- ✅ PNW branding (orange/yellow colors)
- ✅ Deal cards with business info
- ✅ Personalized content (user preferences)
- ✅ Unsubscribe links
- ✅ Professional footer

### Future Email Templates:

- Welcome email for new subscribers
- Business onboarding emails
- Deal expiration reminders
- Monthly digest for businesses

## 🔄 Newsletter Content Flow

### What Gets Sent:

1. **Only deals from past 7 days** (fresh content)
2. **Only deals matching user's original category preferences** (no spam)
3. **Professional email template** with business branding
4. **Direct links to business pages** (drives traffic)

### What Businesses Need to Do:

1. Log into business portal
2. Create deals with title, description, dates
3. Deals automatically included in next newsletter
4. Track results through increased traffic

## ✅ Setup Complete!

Once you've completed these steps:

1. ✅ Resend account created and API key added
2. ✅ Domain verified (optional but recommended)
3. ✅ Test email sent successfully
4. ✅ Newsletter script runs without errors
5. ✅ Scheduled function deployed to Netlify

Your email system is ready for production! 🎉

## 📞 Support

If you need help:

- Check [Resend Documentation](https://resend.com/docs)
- Review your Resend dashboard for delivery issues
- Test with the debug commands above
- Check Netlify function logs for scheduled newsletter issues

# 📧 PNW Deals Email System

## Overview

PNW Deals uses a **weekly newsletter system** that sends personalized deal updates to subscribers every Monday at 9 AM UTC.

## How It Works

### 🗓️ Weekly Schedule

- **When**: Every Monday at 9 AM UTC
- **What**: Deals created in the past 7 days
- **Who**: Only users with matching category preferences

### 🎯 Personalization

- Users receive **ONLY** deals from categories/subcategories they originally selected
- No spam - if no relevant deals exist, no email is sent
- Professional, branded email template

### 📝 Email Content

Each newsletter includes:

- Personalized greeting
- Count of new deals for the user
- Deal details with business information
- Direct links to business pages
- Unsubscribe and preference management links

## Technical Implementation

### Database Structure

```sql
-- Users select their preferences
user_categories (user_id, category_id)
user_subcategories (user_id, subcategory_id)

-- Newsletter subscriptions
subscriptions (user_id, plan_type='newsletter', status='active')

-- Deals are linked to businesses with categories
deals -> businesses -> categories/subcategories
```

### Email Filtering Logic

```javascript
// Only deals from past 7 days
const oneWeekAgo = subDays(new Date(), 7);
const recentDeals = deals.filter((deal) => deal.created_at >= oneWeekAgo);

// Only deals matching user preferences
const personalizedDeals = recentDeals.filter((deal) => {
  const matchesCategory = userCategories.includes(deal.business.category_id);
  const matchesSubcategory = userSubcategories.includes(
    deal.business.subcategory_id
  );
  return matchesCategory || matchesSubcategory;
});
```

## Setup & Configuration

### Environment Variables

```env
RESEND_API_KEY=re_your_api_key
APP_URL=https://your-domain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### Netlify Scheduled Function

```toml
# netlify.toml
[[scheduled]]
  function = "send-deal-notifications"
  cron = "0 9 * * 1"  # Every Monday at 9 AM UTC
```

## Testing

### Manual Testing

```bash
# Test the newsletter system
npm run test-newsletter

# Send newsletter manually
npm run send-weekly-newsletter

# Check production readiness
npm run production-check
```

### Test Checklist

- [ ] Create test users with different category preferences
- [ ] Create test deals in various categories
- [ ] Run manual newsletter send
- [ ] Verify emails received with correct deals
- [ ] Check email formatting and links
- [ ] Test unsubscribe functionality

## Email Template Features

### Professional Design

- Branded header with PNW Deals colors
- Clean, mobile-responsive layout
- Clear call-to-action buttons
- Professional footer with unsubscribe links

### Deal Information

- Deal title and discount badge
- Business name and description
- Deal description and dates
- Direct link to business page

### User Experience

- Personalized greeting
- Clear deal count in subject line
- Easy preference management
- Professional branding throughout

## Monitoring & Analytics

### Key Metrics

- **Open Rate**: Track email opens
- **Click Rate**: Monitor business page visits
- **Unsubscribe Rate**: Watch for user churn
- **Delivery Rate**: Ensure emails reach inboxes

### Logging

The system logs:

- Number of emails sent
- Number of emails skipped (no relevant deals)
- Date range of deals included
- Any delivery errors

## Troubleshooting

### Common Issues

**No emails being sent**

- Check Resend API key configuration
- Verify scheduled function is enabled
- Check for active subscribers in database

**Users not receiving relevant deals**

- Verify user category preferences are saved
- Check deal-to-business-to-category relationships
- Ensure deals have proper created_at timestamps

**Email formatting issues**

- Test with different email clients
- Verify APP_URL is set correctly
- Check for HTML encoding issues

### Debug Commands

```bash
# Test database connections
npm run check-db

# Test newsletter logic
npm run test-newsletter

# Manual newsletter send (with logging)
npm run send-weekly-newsletter
```

## Best Practices

### Content Guidelines

- Keep deal descriptions concise and compelling
- Include clear expiration dates
- Use consistent discount formatting
- Ensure business information is complete

### User Experience

- Respect user preferences strictly
- Provide easy unsubscribe options
- Keep email frequency consistent
- Maintain professional branding

### Technical Maintenance

- Monitor email delivery rates
- Update dependencies regularly
- Test with various email clients
- Keep backup of email templates

## Future Enhancements

### Potential Features

- **A/B Testing**: Test different email templates
- **Segmentation**: More granular user preferences
- **Analytics**: Detailed engagement tracking
- **Personalization**: AI-powered deal recommendations
- **Mobile App**: Push notifications for deals

### Scalability Considerations

- **Email Queuing**: For high-volume sending
- **Rate Limiting**: Respect Resend API limits
- **Caching**: Cache user preferences
- **Database Optimization**: Index frequently queried columns

---

## 🚀 Quick Start

1. **Setup Environment**

   ```bash
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Test System**

   ```bash
   npm run test-newsletter
   ```

3. **Send Test Newsletter**

   ```bash
   npm run send-weekly-newsletter
   ```

4. **Deploy**
   - Push to production
   - Verify scheduled function is active
   - Monitor first automated send

**The system is designed to be simple, reliable, and respectful of user preferences while providing valuable, personalized content to subscribers.**

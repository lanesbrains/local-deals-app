# 📧 Professional Supabase Email Templates

## Setup Instructions

1. Go to your Supabase dashboard
2. Navigate to Authentication → Email Templates
3. Replace the default templates with these professional versions

## 🎯 Email Confirmation Template

### Subject Line:

```
Welcome to PNW Deals! Please confirm your email
```

### HTML Template:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to PNW Deals</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1a1a1a;"
  >
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
      <!-- Header -->
      <div
        style="background: linear-gradient(135deg, #F28C38, #E8B923); padding: 40px 30px; text-align: center;"
      >
        <h1
          style="margin: 0; color: white; font-size: 32px; font-weight: bold;"
        >
          🌲 Welcome to PNW Deals!
        </h1>
        <p
          style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;"
        >
          Your gateway to the best Pacific Northwest deals
        </p>
      </div>

      <!-- Content -->
      <div
        style="padding: 40px 30px; background-color: #2a2a2a; color: #ffffff;"
      >
        <h2 style="color: #F28C38; margin: 0 0 20px 0; font-size: 24px;">
          Almost there! 🎉
        </h2>

        <p
          style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #cccccc;"
        >
          Thanks for joining PNW Deals! We're excited to help you discover
          amazing local deals across Washington, Oregon, Idaho, and Montana.
        </p>

        <p
          style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;"
        >
          Please confirm your email address to complete your signup and start
          receiving personalized deals:
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="{{ .ConfirmationURL }}"
            style="background: linear-gradient(135deg, #F28C38, #E8B923); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;"
          >
            Confirm My Email Address
          </a>
        </div>

        <p
          style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;"
        >
          If the button doesn't work, copy and paste this link into your
          browser:<br />
          <a
            href="{{ .ConfirmationURL }}"
            style="color: #E8B923; word-break: break-all;"
            >{{ .ConfirmationURL }}</a
          >
        </p>
      </div>

      <!-- What's Next -->
      <div style="padding: 30px; background-color: #333333; color: #ffffff;">
        <h3 style="color: #E8B923; margin: 0 0 15px 0; font-size: 20px;">
          What happens next?
        </h3>

        <div style="margin-bottom: 15px;">
          <span style="color: #F28C38; font-weight: bold;">1.</span>
          <span style="margin-left: 10px; color: #cccccc;"
            >Complete your payment ($1/month)</span
          >
        </div>

        <div style="margin-bottom: 15px;">
          <span style="color: #F28C38; font-weight: bold;">2.</span>
          <span style="margin-left: 10px; color: #cccccc;"
            >Receive your first newsletter every Monday</span
          >
        </div>

        <div style="margin-bottom: 15px;">
          <span style="color: #F28C38; font-weight: bold;">3.</span>
          <span style="margin-left: 10px; color: #cccccc;"
            >Discover amazing local deals tailored to your interests</span
          >
        </div>
      </div>

      <!-- Footer -->
      <div
        style="padding: 20px 30px; background-color: #1a1a1a; text-align: center; border-top: 1px solid #333;"
      >
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
          Questions? Reply to this email or visit our website.
        </p>
        <p style="color: #666; font-size: 12px; margin: 0;">
          &copy; 2025 PNW Deals - Supporting Local Pacific Northwest Businesses
        </p>
      </div>
    </div>
  </body>
</html>
```

## 🔐 Password Recovery Template

### Subject Line:

```
Reset your PNW Deals password
```

### HTML Template:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password - PNW Deals</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1a1a1a;"
  >
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
      <!-- Header -->
      <div
        style="background: linear-gradient(135deg, #F28C38, #E8B923); padding: 40px 30px; text-align: center;"
      >
        <h1
          style="margin: 0; color: white; font-size: 28px; font-weight: bold;"
        >
          🔐 Password Reset
        </h1>
        <p
          style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;"
        >
          PNW Deals Account Security
        </p>
      </div>

      <!-- Content -->
      <div
        style="padding: 40px 30px; background-color: #2a2a2a; color: #ffffff;"
      >
        <h2 style="color: #F28C38; margin: 0 0 20px 0; font-size: 24px;">
          Reset Your Password
        </h2>

        <p
          style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #cccccc;"
        >
          We received a request to reset the password for your PNW Deals
          account.
        </p>

        <p
          style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;"
        >
          Click the button below to create a new password:
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="{{ .ConfirmationURL }}"
            style="background: linear-gradient(135deg, #F28C38, #E8B923); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;"
          >
            Reset My Password
          </a>
        </div>

        <p
          style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;"
        >
          If the button doesn't work, copy and paste this link into your
          browser:<br />
          <a
            href="{{ .ConfirmationURL }}"
            style="color: #E8B923; word-break: break-all;"
            >{{ .ConfirmationURL }}</a
          >
        </p>

        <div
          style="background-color: #444; padding: 20px; border-radius: 8px; margin-top: 30px;"
        >
          <p
            style="color: #E8B923; font-weight: bold; margin: 0 0 10px 0; font-size: 16px;"
          >
            🛡️ Security Note
          </p>
          <p
            style="color: #cccccc; margin: 0; font-size: 14px; line-height: 1.5;"
          >
            If you didn't request this password reset, you can safely ignore
            this email. Your password will remain unchanged.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        style="padding: 20px 30px; background-color: #1a1a1a; text-align: center; border-top: 1px solid #333;"
      >
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
          Questions? Reply to this email or visit our website.
        </p>
        <p style="color: #666; font-size: 12px; margin: 0;">
          &copy; 2025 PNW Deals - Supporting Local Pacific Northwest Businesses
        </p>
      </div>
    </div>
  </body>
</html>
```

## 📱 Magic Link Template (if using magic links)

### Subject Line:

```
Your PNW Deals login link
```

### HTML Template:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login to PNW Deals</title>
  </head>
  <body
    style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1a1a1a;"
  >
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
      <!-- Header -->
      <div
        style="background: linear-gradient(135deg, #F28C38, #E8B923); padding: 40px 30px; text-align: center;"
      >
        <h1
          style="margin: 0; color: white; font-size: 28px; font-weight: bold;"
        >
          🔑 Login to PNW Deals
        </h1>
      </div>

      <!-- Content -->
      <div
        style="padding: 40px 30px; background-color: #2a2a2a; color: #ffffff;"
      >
        <h2 style="color: #F28C38; margin: 0 0 20px 0; font-size: 24px;">
          Your secure login link
        </h2>

        <p
          style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;"
        >
          Click the button below to securely log in to your PNW Deals account:
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="{{ .ConfirmationURL }}"
            style="background: linear-gradient(135deg, #F28C38, #E8B923); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;"
          >
            Log In to PNW Deals
          </a>
        </div>

        <p
          style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;"
        >
          This link will expire in 1 hour for security reasons.
        </p>
      </div>

      <!-- Footer -->
      <div
        style="padding: 20px 30px; background-color: #1a1a1a; text-align: center; border-top: 1px solid #333;"
      >
        <p style="color: #666; font-size: 12px; margin: 0;">
          &copy; 2025 PNW Deals - Supporting Local Pacific Northwest Businesses
        </p>
      </div>
    </div>
  </body>
</html>
```

## 🎨 Email Template Setup Steps

1. **Go to Supabase Dashboard**
2. **Navigate to Authentication → Email Templates**
3. **Select each template type:**
   - Confirm signup
   - Reset password
   - Magic link (if using)
4. **Replace the default HTML with the templates above**
5. **Update the subject lines**
6. **Test the templates by:**
   - Creating a test account
   - Requesting password reset
   - Checking email formatting on mobile

## 📧 Email Best Practices Applied

✅ **Professional branding** with PNW colors and logo
✅ **Mobile-responsive** design
✅ **Clear call-to-action** buttons
✅ **Security messaging** for password resets
✅ **Consistent styling** with your app
✅ **Helpful next steps** information
✅ **Professional footer** with company info

These templates will make your app look much more professional and trustworthy! 🎉

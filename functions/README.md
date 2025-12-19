# Firebase Functions - Contact Form Email Trigger

This Firebase Cloud Function automatically sends emails when users submit the contact form on the Mark Global website.

## How It Works

1. User fills out the contact form on the website
2. Form data is saved to Firestore (`contacts` collection)
3. Firebase Function triggers on new document creation
4. Two emails are sent:
   - **Confirmation email** to the user thanking them for reaching out
   - **Notification email** to admin with the contact details

## Setup Instructions

### 1. Enable Firebase Services

Make sure you have enabled the following in your Firebase Console:
- **Firestore Database** - for storing contact submissions
- **Cloud Functions** - for the email trigger

### 2. Configure Environment Variables

Create a `.env` file in the `functions` folder with your email credentials:

```bash
cp .env.example .env
```

Then fill in your email configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=info@themarkglobal.co.in
```

### 3. Gmail App Password (if using Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Generate an App Password for "Mail"
5. Use this password as `EMAIL_PASS`

### 4. Deploy Functions

```bash
# From the root project directory
firebase deploy --only functions

# Or from the functions directory
cd functions
npm run deploy
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Local Development

To test functions locally:

```bash
cd functions
npm run serve
```

This will start the Firebase emulators.

## Client-Side Setup

Make sure the main website has Firebase configured:

1. Copy `.env.example` to `.env.local` in the root directory
2. Fill in your Firebase project config values
3. The values can be found in Firebase Console > Project Settings > Your Apps

## Email Templates

The function sends two HTML email templates:
- **User confirmation** - Thanks the user and shows their message
- **Admin notification** - Includes all form details with reply button

## Firestore Structure

```
contacts/
  {contactId}/
    name: string
    email: string
    message: string
    createdAt: timestamp
    emailSent: boolean (set by function)
    emailSentAt: timestamp (set by function)
```

## Troubleshooting

### Emails not sending?
- Check the function logs: `firebase functions:log`
- Verify email credentials in `.env`
- For Gmail, make sure you're using an App Password

### Function not deploying?
- Run `npm run build` to check for TypeScript errors
- Ensure you're on Node.js 20

### Firestore permission errors?
- Deploy the Firestore rules: `firebase deploy --only firestore:rules`

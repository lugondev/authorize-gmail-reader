# Gmail Reader - Next.js Application

A simple web application to authorize and read Gmail messages using Google OAuth 2.0.

## Features

- Google OAuth 2.0 authentication
- Read Gmail messages
- Display message details (sender, subject, snippet, date)
- Simple and clean UI built with Tailwind CSS

## Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router)
- **UI Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Google OAuth 2.0
- **API**: Gmail API (googleapis)
- **Language**: TypeScript
- **Package Manager**: pnpm

## Setup Instructions

### 1. Google Cloud Console Setup

Before running the application, you need to configure the OAuth consent screen and authorized redirect URIs in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID
5. Add the following to **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback
   ```
6. Navigate to **APIs & Services** > **OAuth consent screen**
7. Configure the consent screen with required information
8. Add test users if your app is in testing mode

### 2. Environment Variables

The `.env.local` file has been created with your credentials. Make sure it contains:

```env
GOOGLE_CLIENT_ID=****.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=***
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
authorize-gmail-reader/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts    # OAuth callback handler
│   │   │   ├── logout/route.ts      # Logout endpoint
│   │   │   ├── status/route.ts      # Check auth status
│   │   │   └── url/route.ts         # Generate auth URL
│   │   └── gmail/
│   │       └── messages/route.ts    # Fetch Gmail messages
│   └── page.tsx                     # Main UI page
├── lib/
│   ├── gmail_client.ts              # Gmail API client wrapper
│   └── types/
│       └── gmail_types.ts           # TypeScript type definitions
└── .env.local                       # Environment variables
```

## API Endpoints

### Authentication
- `GET /api/auth/url` - Generate Google OAuth URL
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout and clear session

### Gmail
- `GET /api/gmail/messages?maxResults=10` - Fetch Gmail messages

## Usage

1. Click **Sign in with Google** button
2. Authorize the application to access your Gmail
3. View your recent Gmail messages
4. Click **Refresh** to reload messages
5. Click **Logout** to sign out

## Security Notes

- Tokens are stored in HTTP-only cookies
- In production, use a secure session storage solution
- Change `NEXTAUTH_SECRET` to a strong random value
- Enable HTTPS in production
- Review and limit OAuth scopes as needed

## Gmail API Scopes

The application requests the following scopes:
- `https://www.googleapis.com/auth/gmail.readonly` - Read Gmail messages
- `https://www.googleapis.com/auth/userinfo.email` - Read user email

## Troubleshooting

### "redirect_uri_mismatch" error
Make sure `http://localhost:3000/api/auth/callback` is added to Authorized redirect URIs in Google Cloud Console.

### "Access blocked: This app's request is invalid"
Configure the OAuth consent screen in Google Cloud Console and add your email as a test user.

### Messages not loading
Check browser console for errors and ensure you have messages in your Gmail account.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## License

MIT


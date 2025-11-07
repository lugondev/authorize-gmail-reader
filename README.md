# Gmail Reader API - Next.js Application

A RESTful API service to authorize and read Gmail messages using Google OAuth 2.0, with comprehensive Swagger documentation.

## Features

- Google OAuth 2.0 authentication flow
- RESTful API endpoints for Gmail message retrieval
- Swagger/OpenAPI documentation
- Read Gmail messages with pagination support
- Get individual message details
- Token-based authentication
- Export authentication tokens
- Privacy policy and terms of service pages
- Clean API architecture with TypeScript

## Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router)
- **UI Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Google OAuth 2.0
- **API**: Gmail API (googleapis)
- **Documentation**: Swagger UI + swagger-jsdoc
- **Validation**: Zod
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
   http://localhost:3333/api/auth/callback
   ```
   For production:
   ```
   https://your-domain.com/api/auth/callback
   ```
6. Navigate to **APIs & Services** > **OAuth consent screen**
7. Configure the consent screen with required information
8. Add test users if your app is in testing mode

### 2. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```
### 4. Run Development Server

```bash
pnpm dev
```

The application will run on [http://localhost:3333](http://localhost:3333).
NEXTAUTH_URL=http://localhost:3333
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
│   │   │   ├── export/route.ts      # Export auth tokens
│   │   │   ├── logout/route.ts      # Logout endpoint
│   │   │   ├── status/route.ts      # Check auth status
│   │   │   └── url/route.ts         # Generate auth URL
│   │   ├── docs/route.ts            # Swagger JSON endpoint
│   │   ├── gmail/
│   │   │   └── messages/
│   │   │       ├── route.ts         # Fetch messages (deprecated)
│   │   │       └── [id]/route.ts    # Get message by ID (deprecated)
│   │   └── v1/
│   │       └── messages/
│   │           ├── route.ts         # Fetch messages (v1 API)
│   │           └── [id]/route.ts    # Get message by ID (v1 API)
## API Documentation

Full API documentation is available at:
- **Swagger UI**: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)
- **OpenAPI JSON**: [http://localhost:3333/api/docs](http://localhost:3333/api/docs)
- **Detailed Guide**: See [API_README.md](./API_README.md)

## API Endpoints

### Authentication
- `GET /api/auth/url` - Generate Google OAuth URL
## Usage

### Web Interface
1. Visit [http://localhost:3333](http://localhost:3333)
2. Click **Sign in with Google** button
3. Authorize the application to access your Gmail
4. View your recent Gmail messages
5. Click **Refresh** to reload messages
6. Click **Logout** to sign out

### API Usage

1. **Authenticate**: Visit the web interface and sign in with Google
2. **Export Token**: Click "Export Tokens" or call `GET /api/auth/export`
3. **Use API**: Include the access token in requests:

```bash
# List messages
curl -X GET "http://localhost:3333/api/v1/messages?maxResults=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get specific message
## Troubleshooting

### "redirect_uri_mismatch" error
Make sure `http://localhost:3333/api/auth/callback` is added to Authorized redirect URIs in Google Cloud Console.

### "Access blocked: This app's request is invalid"
Configure the OAuth consent screen in Google Cloud Console and add your email as a test user.

### Messages not loading
Check browser console for errors and ensure you have messages in your Gmail account.

## Development

### Scripts

- `pnpm dev` - Start development server on port 3333
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Adding New Endpoints

1. Create route handler in `app/api/v1/`
2. Add Swagger JSDoc comments for documentation
3. Update `lib/swagger.ts` if needed
4. Test using Swagger UI

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Update `GOOGLE_REDIRECT_URI` to production URL
5. Add production redirect URI to Google Cloud Console

### Other Platforms

Ensure Node.js 18+ is available and set environment variables accordingly.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [API Documentation](./API_README.md)

## License

MITf -ti:3333 | xargs kill -9
```
  - Requires: `Authorization: Bearer <token>` header
- `GET /api/v1/messages/:id` - Get specific message by ID
  - Requires: `Authorization: Bearer <token>` header

### Deprecated (Legacy)
- `GET /api/gmail/messages` - Use `/api/v1/messages` instead
- `GET /api/gmail/messages/:id` - Use `/api/v1/messages/:id` instead
│       └── gmail_types.ts           # TypeScript type definitions
├── .env.local                       # Environment variables (git-ignored)
├── .env.example                     # Environment variables template
└── API_README.md                    # API documentation
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


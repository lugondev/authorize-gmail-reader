import { NextRequest, NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/callback:
 *   get:
 *     summary: OAuth2 callback handler
 *     description: |
 *       Handles the OAuth2 callback from Google after user authentication.
 *       
 *       **Note:** This endpoint is automatically called by Google's OAuth flow.
 *       You should not call this endpoint directly.
 *       
 *       ### Process:
 *       1. Receives authorization code from Google
 *       2. Exchanges code for access/refresh tokens
 *       3. Stores tokens securely in HTTP-only cookies
 *       4. Retrieves user profile information
 *       5. Redirects back to home page
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google OAuth
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *     responses:
 *       302:
 *         description: Redirects to home page on success or error
 *       400:
 *         description: Missing authorization code
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=no_code', request.url)
      );
    }

    const gmailClient = new GmailClient();
    const tokens = await gmailClient.getTokenFromCode(code);

    // Store tokens in cookies (in production, use a secure session storage)
    const cookieStore = await cookies();
    cookieStore.set('gmail_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Get user profile
    gmailClient.setCredentials(tokens);
    const profile = await gmailClient.getUserProfile();
    
    cookieStore.set('user_email', profile.email || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.redirect(new URL('/?success=true', request.url));
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_failed', request.url)
    );
  }
}

import { NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';

/**
 * @swagger
 * /api/auth/url:
 *   get:
 *     summary: Get OAuth2 authorization URL
 *     description: Returns the Google OAuth2 authorization URL for initiating the authentication flow
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Authorization URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authUrl:
 *                   type: string
 *                   description: Google OAuth2 authorization URL
 *                   example: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
 *       500:
 *         description: Failed to generate authorization URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    // Log environment configuration (without sensitive data)
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
    
    console.log('OAuth Configuration:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      redirectUri,
      nodeEnv: process.env.NODE_ENV,
    });

    const gmailClient = new GmailClient();
    const authUrl = gmailClient.getAuthUrl();

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}

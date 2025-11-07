import { NextRequest, NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';
import { cookies } from 'next/headers';

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

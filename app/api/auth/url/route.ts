import { NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';

export async function GET() {
  try {
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

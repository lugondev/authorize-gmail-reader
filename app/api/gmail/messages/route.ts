import { NextRequest, NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokensString = cookieStore.get('gmail_tokens')?.value;

    if (!tokensString) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensString);
    const gmailClient = new GmailClient();
    gmailClient.setCredentials(tokens);

    const searchParams = request.nextUrl.searchParams;
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const labelIds = searchParams.get('labelIds')?.split(',').filter(Boolean);

    const messages = await gmailClient.getMessages(maxResults, labelIds);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

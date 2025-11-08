import { NextRequest, NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/gmail/messages:
 *   get:
 *     summary: Get Gmail messages (Cookie Auth)
 *     description: |
 *       Retrieves Gmail messages using cookie-based authentication.
 *       
 *       **Note:** This endpoint requires browser authentication via cookies.
 *       For API integrations, use `/api/v1/messages` with Bearer token instead.
 *       
 *       ### Authentication:
 *       - Uses HTTP-only cookies set after web login
 *       - Automatically authenticated if logged in via browser
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: query
 *         name: maxResults
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of messages to return
 *       - in: query
 *         name: labelIds
 *         schema:
 *           type: string
 *         description: Comma-separated list of label IDs to filter by
 *         example: INBOX,UNREAD
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MessageSummary'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not authenticated
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

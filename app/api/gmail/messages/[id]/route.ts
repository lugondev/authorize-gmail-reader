import { NextRequest, NextResponse } from 'next/server';
import { GmailClient } from '@/lib/gmail_client';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/gmail/messages/{id}:
 *   get:
 *     summary: Get message details (Cookie Auth)
 *     description: |
 *       Retrieves detailed information about a specific Gmail message using cookie-based authentication.
 *       
 *       **Note:** This endpoint requires browser authentication via cookies.
 *       For API integrations, use `/api/v1/messages/{id}` with Bearer token instead.
 *       
 *       ### Authentication:
 *       - Uses HTTP-only cookies set after web login
 *       - Automatically authenticated if logged in via browser
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique Gmail message ID
 *         example: 18c1234567890abcd
 *     responses:
 *       200:
 *         description: Message details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/MessageDetail'
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const message = await gmailClient.getMessageById(id);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message details' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * @swagger
 * /api/v1/messages:
 *   get:
 *     summary: List Gmail messages
 *     description: |
 *       Retrieves a list of Gmail messages from the authenticated user's mailbox.
 *       
 *       ### Authentication Required:
 *       - Include your OAuth2 access token in the Authorization header
 *       - Token can be obtained from `/api/auth/export` endpoint
 *       
 *       ### Features:
 *       - Returns message metadata including sender, subject, and preview
 *       - Configurable result limit (1-100 messages)
 *       - Sorted by most recent first
 *       
 *       ### Example Request:
 *       ```bash
 *       curl -X GET "http://localhost:3333/api/v1/messages?maxResults=20" \
 *         -H "Authorization: Bearer ya29.a0AfB_byC..."
 *       ```
 *     tags:
 *       - Messages
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maxResults
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of messages to return
 *         example: 20
 *     responses:
 *       200:
 *         description: List of messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MessageSummary'
 *                     total:
 *                       type: integer
 *                       description: Total number of messages returned
 *                       example: 20
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authorization header missing or invalid. Use: Bearer <access_token>' 
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const searchParams = request.nextUrl.searchParams;
    const maxResults = parseInt(searchParams.get('maxResults') || '20');

    // Create OAuth2 client with access token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Get message list
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
    });

    const messages = response.data.messages || [];

    // Get detailed info for each message
    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });

        const headers = detail.data.payload?.headers || [];
        const getHeader = (name: string) => {
          const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
          return header?.value || '';
        };

        return {
          id: detail.data.id,
          threadId: detail.data.threadId,
          labelIds: detail.data.labelIds,
          snippet: detail.data.snippet,
          internalDate: detail.data.internalDate,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        messages: detailedMessages,
        total: detailedMessages.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid or expired access token' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch messages',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

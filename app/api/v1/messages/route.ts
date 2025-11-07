import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * @swagger
 * /api/v1/messages:
 *   get:
 *     summary: Get list of Gmail messages
 *     description: Fetch a list of Gmail messages using Bearer token authentication
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           threadId:
 *                             type: string
 *                           labelIds:
 *                             type: array
 *                             items:
 *                               type: string
 *                           snippet:
 *                             type: string
 *                           internalDate:
 *                             type: string
 *                           from:
 *                             type: string
 *                           to:
 *                             type: string
 *                           subject:
 *                             type: string
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
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

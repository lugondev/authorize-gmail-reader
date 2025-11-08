import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * @swagger
 * /api/v1/messages/{id}:
 *   get:
 *     summary: Get message details
 *     description: |
 *       Retrieves detailed information about a specific Gmail message including full email body.
 *       
 *       ### Authentication Required:
 *       - Include your OAuth2 access token in the Authorization header
 *       
 *       ### Returns:
 *       - Complete message metadata (sender, recipient, subject, date)
 *       - Full email body in both HTML and plain text formats (when available)
 *       - Message labels and thread information
 *       
 *       ### Example Request:
 *       ```bash
 *       curl -X GET "http://localhost:3333/api/v1/messages/18c1234567890abcd" \
 *         -H "Authorization: Bearer ya29.a0AfB_byC..."
 *       ```
 *     tags:
 *       - Messages
 *     security:
 *       - BearerAuth: []
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MessageDetail'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get message details
    const response = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });

    const message = response.data;
    const headers = message.payload?.headers || [];
    
    const getHeader = (name: string) => {
      const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
      return header?.value || '';
    };

    // Extract body content
    let bodyHtml = '';
    let bodyText = '';

    const getBody = (parts: any[]): void => {
      parts.forEach((part) => {
        if (part.mimeType === 'text/html' && part.body?.data) {
          bodyHtml = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          getBody(part.parts);
        }
      });
    };

    if (message.payload?.parts) {
      getBody(message.payload.parts);
    } else if (message.payload?.body?.data) {
      const mimeType = message.payload.mimeType;
      const bodyData = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
      if (mimeType === 'text/html') {
        bodyHtml = bodyData;
      } else {
        bodyText = bodyData;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        threadId: message.threadId,
        labelIds: message.labelIds,
        snippet: message.snippet,
        internalDate: message.internalDate,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        bodyHtml,
        bodyText,
      },
    });
  } catch (error: any) {
    console.error('Error fetching message:', error);
    
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid or expired access token' 
        },
        { status: 401 }
      );
    }

    if (error.code === 404) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Message not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch message details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

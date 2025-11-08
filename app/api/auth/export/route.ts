import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/export:
 *   get:
 *     summary: Export authentication tokens
 *     description: |
 *       Returns the current OAuth2 authentication tokens for external API usage.
 *       
 *       **Important:** You must be authenticated via the web interface first.
 *       
 *       ### Usage:
 *       1. Login via web interface at `/`
 *       2. Call this endpoint to retrieve your access token
 *       3. Use the `access_token` in the Authorization header for API requests
 *       
 *       ### Example:
 *       ```
 *       Authorization: Bearer ya29.a0AfB_byC...
 *       ```
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Authentication data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *                 usage:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: Use this authentication data to make API requests
 *                     example:
 *                       type: object
 *                       properties:
 *                         headers:
 *                           type: object
 *                           properties:
 *                             Authorization:
 *                               type: string
 *                               example: Bearer ya29.a0AfB_byC...
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Not authenticated. Please login first.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokensString = cookieStore.get('gmail_tokens')?.value;

    if (!tokensString) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Not authenticated. Please login first.' 
        },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensString);

    return NextResponse.json({
      success: true,
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      },
      usage: {
        description: 'Use this authentication data to make API requests',
        example: {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error exporting auth data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to export authentication data' 
      },
      { status: 500 }
    );
  }
}

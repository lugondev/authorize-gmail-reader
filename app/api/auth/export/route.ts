import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/export:
 *   get:
 *     summary: Export authentication data
 *     description: Returns the current authentication tokens for external API usage
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     scope:
 *                       type: string
 *                     token_type:
 *                       type: string
 *                     expiry_date:
 *                       type: number
 *       401:
 *         description: Not authenticated
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

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears authentication tokens and logs out the current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to logout
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('gmail_tokens');
    cookieStore.delete('user_email');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

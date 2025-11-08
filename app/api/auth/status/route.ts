import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check authentication status
 *     description: Returns whether the user is currently authenticated and their email address
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Authentication status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   description: Whether user is authenticated
 *                   example: true
 *                 email:
 *                   type: string
 *                   nullable: true
 *                   description: User's email address if authenticated
 *                   example: user@gmail.com
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokensString = cookieStore.get('gmail_tokens')?.value;
    const userEmail = cookieStore.get('user_email')?.value;

    if (!tokensString) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      email: userEmail || null,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ authenticated: false });
  }
}

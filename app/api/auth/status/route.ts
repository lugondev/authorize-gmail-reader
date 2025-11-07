import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

import { google } from 'googleapis';

export class GmailClient {
  private oauth2Client;

  constructor() {
    // Get redirect URI from environment or construct from base URL
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
  }

  getAuthUrl(): string {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
      redirect_uri: redirectUri, // Explicitly set redirect_uri
    });
  }

  async getTokenFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  async getMessages(maxResults: number = 10, labelIds?: string[]) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds,
    });

    const messages = response.data.messages || [];
    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });
        return detail.data;
      })
    );

    return detailedMessages;
  }

  async getMessageById(messageId: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    return response.data;
  }

  async getUserProfile() {
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const response = await oauth2.userinfo.get();
    return response.data;
  }
}

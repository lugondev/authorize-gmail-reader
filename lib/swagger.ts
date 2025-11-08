import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gmail Reader API',
      version: '1.0.0',
      description: `
## Gmail Reader API Documentation

This API provides endpoints for reading Gmail messages with OAuth2 authentication.

### Getting Started

1. **Authenticate via Web Interface**: Visit the home page and click "Login with Google"
2. **Export Tokens**: After successful login, call \`GET /api/auth/export\` to get your access token
3. **Use Token**: Include the access token in the Authorization header for all API requests

### Authentication Flow

\`\`\`
1. GET /api/auth/url → Returns Google OAuth URL
2. User authenticates with Google
3. GET /api/auth/callback → Handles OAuth callback
4. GET /api/auth/export → Export access token
5. Use token in Authorization: Bearer <token> header
\`\`\`

### Rate Limits

This API uses Gmail API quota. Please refer to [Google's Gmail API Usage Limits](https://developers.google.com/gmail/api/reference/quota).
      `,
      contact: {
        name: 'API Support',
        url: 'https://github.com/lugondev/authorize-gmail-reader',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3333',
        description: 'API Server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'OAuth2 authentication endpoints for Gmail access',
      },
      {
        name: 'Messages',
        description: 'Gmail message retrieval endpoints',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'OAuth2',
          description: 'OAuth2 access token from Google. Get it via /api/auth/export endpoint after logging in.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message description',
            },
            details: {
              type: 'string',
              example: 'Additional error details',
            },
          },
        },
        MessageSummary: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique message ID',
              example: '18c1234567890abcd',
            },
            threadId: {
              type: 'string',
              description: 'Thread ID this message belongs to',
              example: '18c1234567890abcd',
            },
            labelIds: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Labels associated with the message',
              example: ['INBOX', 'UNREAD'],
            },
            snippet: {
              type: 'string',
              description: 'Short preview of the message content',
              example: 'This is a preview of the message...',
            },
            internalDate: {
              type: 'string',
              description: 'Internal date of the message (milliseconds since epoch)',
              example: '1699123456789',
            },
            from: {
              type: 'string',
              description: 'Sender email address',
              example: 'sender@example.com',
            },
            to: {
              type: 'string',
              description: 'Recipient email address',
              example: 'you@gmail.com',
            },
            subject: {
              type: 'string',
              description: 'Email subject',
              example: 'Test Email Subject',
            },
          },
        },
        MessageDetail: {
          allOf: [
            { $ref: '#/components/schemas/MessageSummary' },
            {
              type: 'object',
              properties: {
                bodyHtml: {
                  type: 'string',
                  description: 'HTML content of the email body',
                  example: '<html><body>Email content</body></html>',
                },
                bodyText: {
                  type: 'string',
                  description: 'Plain text content of the email body',
                  example: 'Email content in plain text',
                },
              },
            },
          ],
        },
        AuthTokens: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'OAuth2 access token for API requests',
              example: 'ya29.a0AfB_byC...',
            },
            refresh_token: {
              type: 'string',
              description: 'OAuth2 refresh token to obtain new access tokens',
              example: '1//0gHZ9I2-abc...',
            },
            scope: {
              type: 'string',
              description: 'Granted OAuth2 scopes',
              example: 'https://www.googleapis.com/auth/gmail.readonly',
            },
            token_type: {
              type: 'string',
              description: 'Token type',
              example: 'Bearer',
            },
            expiry_date: {
              type: 'number',
              description: 'Token expiry timestamp (milliseconds since epoch)',
              example: 1699127056789,
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required or token invalid/expired',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Invalid or expired access token',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Message not found',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                error: 'Failed to process request',
                details: 'Detailed error message',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./app/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

# Gmail Reader API

## Overview
This project provides API endpoints to read Gmail messages using OAuth2 authentication.

## API Documentation

Access the interactive Swagger UI documentation at: `/api-docs`

## Authentication Flow

### 1. Export Authentication Data
After logging in via the web interface, export your authentication tokens:

**Endpoint:** `GET /api/auth/export`

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "ya29.xxx...",
    "refresh_token": "1//xxx...",
    "scope": "...",
    "token_type": "Bearer",
    "expiry_date": 1234567890
  },
  "usage": {
    "description": "Use this authentication data to make API requests",
    "example": {
      "headers": {
        "Authorization": "Bearer ya29.xxx..."
      }
    }
  }
}
```

## API Endpoints

### Get Messages List
**Endpoint:** `GET /api/v1/messages`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `maxResults` (optional): Number of messages to return (default: 20, max: 100)

**Example:**
```bash
curl -X GET "http://localhost:3333/api/v1/messages?maxResults=10" \
  -H "Authorization: Bearer ya29.xxx..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "18c1234567890abcd",
        "threadId": "18c1234567890abcd",
        "labelIds": ["INBOX", "UNREAD"],
        "snippet": "This is a preview of the message...",
        "internalDate": "1699123456789",
        "from": "sender@example.com",
        "to": "you@gmail.com",
        "subject": "Test Email"
      }
    ],
    "total": 10
  }
}
```

### Get Message Details
**Endpoint:** `GET /api/v1/messages/{id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl -X GET "http://localhost:3333/api/v1/messages/18c1234567890abcd" \
  -H "Authorization: Bearer ya29.xxx..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "18c1234567890abcd",
    "threadId": "18c1234567890abcd",
    "labelIds": ["INBOX", "UNREAD"],
    "snippet": "This is a preview...",
    "internalDate": "1699123456789",
    "from": "sender@example.com",
    "to": "you@gmail.com",
    "subject": "Test Email",
    "bodyHtml": "<html>...</html>",
    "bodyText": "Plain text version..."
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired access token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Message not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch messages",
  "details": "Error message details"
}
```

## Usage Example (JavaScript/TypeScript)

```typescript
// 1. Export authentication data
const authResponse = await fetch('http://localhost:3333/api/auth/export');
const authData = await authResponse.json();
const accessToken = authData.data.access_token;

// 2. Get messages list
const messagesResponse = await fetch('http://localhost:3333/api/v1/messages?maxResults=20', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const messagesData = await messagesResponse.json();

// 3. Get specific message details
const messageId = messagesData.data.messages[0].id;
const detailResponse = await fetch(`http://localhost:3333/api/v1/messages/${messageId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const detailData = await detailResponse.json();
```

## Notes

- Access tokens expire after a certain period. Store the refresh token to obtain new access tokens.
- The API uses Bearer token authentication with OAuth2 tokens from Google.
- All timestamps are in milliseconds since epoch.
- Email body can be in HTML or plain text format (or both).

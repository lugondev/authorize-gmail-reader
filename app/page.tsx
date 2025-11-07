'use client';

import { useState, useEffect } from 'react';
import { GmailMessage } from '@/lib/types/gmail_types';

interface AuthStatus {
  authenticated: boolean;
  email?: string;
}

interface MessageDetail extends GmailMessage {
  bodyHtml?: string;
  bodyText?: string;
}

export default function Home() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    authenticated: false,
  });
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string>('INBOX');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setAuthStatus(data);

      if (data.authenticated) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/url');
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      setError('Failed to initiate login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthStatus({ authenticated: false });
      setMessages([]);
    } catch (err) {
      setError('Failed to logout');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (label?: string) => {
    try {
      setLoading(true);
      setError(null);
      const activeLabel = label || labelFilter;
      const url = `/api/gmail/messages?maxResults=20&labelIds=${activeLabel}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to fetch Gmail messages');
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHeader = (message: GmailMessage, headerName: string): string => {
    const header = message.payload?.headers?.find(
      (h) => h.name.toLowerCase() === headerName.toLowerCase()
    );
    return header?.value || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(parseInt(dateString));
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchMessageDetail = async (messageId: string) => {
    try {
      setLoadingDetail(true);
      setError(null);
      const response = await fetch(`/api/gmail/messages/${messageId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch message details');
      }

      const data = await response.json();
      const message = data.message;

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

      setSelectedMessage({
        ...message,
        bodyHtml,
        bodyText,
      });
    } catch (err) {
      setError('Failed to fetch message details');
      console.error('Fetch message detail error:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeMessageDetail = () => {
    setSelectedMessage(null);
  };

  const handleExportAuth = async () => {
    try {
      setLoadingAuth(true);
      setError(null);
      const response = await fetch('/api/auth/export');
      
      if (!response.ok) {
        throw new Error('Failed to export authentication data');
      }

      const data = await response.json();
      setAuthData(data);
      setShowAuthModal(true);
    } catch (err) {
      setError('Failed to export authentication data');
      console.error('Export auth error:', err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Gmail Reader
              </h1>
              {authStatus.authenticated && authStatus.email && (
                <p className="text-sm text-gray-500 mt-1">{authStatus.email}</p>
              )}
            </div>
            {authStatus.authenticated && (
              <div className="flex gap-2">
                <button
                  onClick={handleExportAuth}
                  disabled={loadingAuth}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Export Auth
                </button>
                <a
                  href="/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  API Docs
                </a>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          {!authStatus.authenticated ? (
            <div className="text-center py-16">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Connect Your Gmail Account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Sign in with Google to access your Gmail messages
              </p>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium text-gray-900">
                    Messages
                  </h2>
                  <select
                    value={labelFilter}
                    onChange={(e) => {
                      setLabelFilter(e.target.value);
                      fetchMessages(e.target.value);
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INBOX">Inbox</option>
                    <option value="TRASH">Trash</option>
                    <option value="SPAM">Spam</option>
                    <option value="SENT">Sent</option>
                    <option value="DRAFT">Draft</option>
                    <option value="UNREAD">Unread</option>
                  </select>
                </div>
                <button
                  onClick={() => fetchMessages()}
                  disabled={loading}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading && messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-500">
                  No messages found
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getHeader(message, 'Subject') || '(No Subject)'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {getHeader(message, 'From')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400">
                            {message.internalDate && formatDate(message.internalDate)}
                          </span>
                          <button
                            onClick={() => fetchMessageDetail(message.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {message.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
                  <button
                    onClick={closeMessageDetail}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">From:</span>
                    <span className="text-gray-800 flex-1">{getHeader(selectedMessage, 'From')}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Subject:</span>
                    <span className="text-gray-800 flex-1">{getHeader(selectedMessage, 'Subject') || '(No Subject)'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Date:</span>
                    <span className="text-gray-800 flex-1">
                      {selectedMessage.internalDate && formatDate(selectedMessage.internalDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {loadingDetail ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="text-sm">
                    {selectedMessage.bodyHtml ? (
                      <div 
                        className="message-body"
                        dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                      />
                    ) : selectedMessage.bodyText ? (
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {selectedMessage.bodyText}
                      </pre>
                    ) : (
                      <p className="text-gray-400 italic">No message content available</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeMessageDetail}
                  className="px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showAuthModal && authData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Authentication Data</h2>
                    <p className="text-xs text-gray-500 mt-1">Use this data to authenticate API requests</p>
                  </div>
                  <button
                    onClick={closeAuthModal}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {authData.success ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs text-blue-800 font-medium mb-1">How to use:</p>
                      <p className="text-xs text-blue-700 mb-2">
                        Copy the access token and use it in your API requests with the Authorization header.
                      </p>
                      <code className="block text-xs bg-blue-100 text-blue-900 p-2 rounded">
                        Authorization: Bearer {authData.data.access_token.substring(0, 30)}...
                      </code>
                    </div>

                    <div className="space-y-2">
                      <div className="border border-gray-200 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-medium text-gray-700">Access Token</label>
                          <button
                            onClick={() => copyToClipboard(authData.data.access_token)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded p-2 overflow-x-auto">
                          <code className="text-xs text-gray-800 break-all">
                            {authData.data.access_token}
                          </code>
                        </div>
                      </div>

                      {authData.data.refresh_token && (
                        <div className="border border-gray-200 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-gray-700">Refresh Token</label>
                            <button
                              onClick={() => copyToClipboard(authData.data.refresh_token)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              Copy
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded p-2 overflow-x-auto">
                            <code className="text-xs text-gray-800 break-all">
                              {authData.data.refresh_token}
                            </code>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-gray-200 rounded p-2">
                          <label className="text-xs font-medium text-gray-700 block mb-1">Token Type</label>
                          <p className="text-xs text-gray-800">{authData.data.token_type}</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded p-2">
                          <label className="text-xs font-medium text-gray-700 block mb-1">Expiry Date</label>
                          <p className="text-xs text-gray-800">
                            {authData.data.expiry_date 
                              ? new Date(authData.data.expiry_date).toLocaleString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-xs text-yellow-800 font-medium">Security Warning</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Keep these tokens secure! Do not share them publicly or commit them to version control.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {authData.error || 'Failed to load authentication data'}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeAuthModal}
                  className="px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-6 text-xs text-gray-500">
          Gmail Reader - Built with Next.js 16 & React 19
        </footer>
      </div>
    </div>
  );
}

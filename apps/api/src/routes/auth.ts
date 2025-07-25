import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = Router();

// OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Store PKCE challenges temporarily (in production, use Redis)
const pkceStore = new Map<string, { codeChallenge: string; provider: string; expiresAt: number }>();

// Clean up expired PKCE challenges
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of pkceStore.entries()) {
    if (value.expiresAt < now) {
      pkceStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Helper functions
const generateState = () => crypto.randomBytes(32).toString('hex');
const verifyCodeChallenge = (verifier: string, challenge: string): boolean => {
  const hash = crypto.createHash('sha256').update(verifier).digest('base64url');
  return hash === challenge;
};

// POST /api/auth/:provider/url - Get OAuth authorization URL
router.post('/:provider/url', async (req, res) => {
  try {
    const { provider } = req.params;
    const { codeChallenge, state } = req.body;

    if (!codeChallenge || !state) {
      return res.status(400).json({ error: 'Code challenge and state are required' });
    }

    // Store PKCE challenge with expiration
    pkceStore.set(state, {
      codeChallenge,
      provider,
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });

    let authUrl: string;
    
    switch (provider) {
      case 'github':
        if (!GITHUB_CLIENT_ID) {
          return res.status(500).json({ error: 'GitHub OAuth not configured' });
        }
        const authUrlObj = new URL('https://github.com/login/oauth/authorize');
        authUrlObj.searchParams.set('client_id', GITHUB_CLIENT_ID);
        authUrlObj.searchParams.set('redirect_uri', `${API_BASE_URL}/api/auth/${provider}/callback`);
        authUrlObj.searchParams.set('scope', 'user:email repo');
        authUrlObj.searchParams.set('state', state);
        authUrl = authUrlObj.toString();
        break;
      
      default:
        return res.status(400).json({ error: 'Unsupported provider' });
    }

    res.json({ url: authUrl });
  } catch (error) {
    console.error('Auth URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// GET /api/auth/:provider/callback - OAuth callback (redirects to extension)
router.get('/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state, error: oauthError } = req.query;

    // Handle OAuth errors
    if (oauthError) {
      return res.redirect(`chrome-extension://callback?error=${encodeURIComponent(oauthError as string)}`);
    }

    if (!code || !state) {
      return res.redirect('chrome-extension://callback?error=missing_parameters');
    }

    // Verify state and get PKCE challenge
    const pkceData = pkceStore.get(state as string);
    if (!pkceData || pkceData.provider !== provider) {
      return res.redirect('chrome-extension://callback?error=invalid_state');
    }

    // Clean up PKCE data
    pkceStore.delete(state as string);

    // Set CSP headers to allow inline scripts for this specific callback page
    res.set({
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline'; object-src 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    });

    // Return success with code for the extension to handle
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            text-align: center; 
            padding: 50px; 
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 400px;
            margin: 0 auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .success { 
            color: #4CAF50; 
            margin: 0 0 16px 0;
            font-size: 24px;
          }
          .message {
            color: #666;
            margin: 16px 0;
            font-size: 16px;
          }
          .loading { 
            animation: spin 1s linear infinite; 
            display: inline-block; 
            font-size: 24px;
            color: #4CAF50;
          }
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          .details {
            margin-top: 24px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✓ Authentication Successful</h1>
          <p class="message">Completing sign-in...</p>
          <div class="loading">⟳</div>
          <div class="details">
            Provider: ${provider}<br>
            Status: Processing authentication
          </div>
        </div>
        <script>
          console.log('OpenMemo: OAuth callback page loaded');
          console.log('Provider: ${provider}');
          console.log('Code: ${code ? (code as string).substring(0, 10) + '...' : 'none'}');
          console.log('State: ${state}');
          
          // Store data in page for content script to access
          window.oauthData = {
            type: 'oauth_success',
            code: '${code}',
            state: '${state}',
            provider: '${provider}'
          };
          
          // Try to communicate with extension directly
          if (typeof chrome !== 'undefined' && chrome.runtime) {
            try {
              chrome.runtime.sendMessage({
                type: 'OAUTH_SUCCESS',
                code: '${code}',
                state: '${state}',
                provider: '${provider}'
              }, function(response) {
                console.log('OpenMemo: Direct extension message response:', response);
              });
            } catch (error) {
              console.error('OpenMemo: Failed to send direct message to extension:', error);
            }
          }
          
          // Try postMessage if opener exists
          try {
            if (window.opener && !window.opener.closed) {
              console.log('OpenMemo: Sending postMessage to opener');
              window.opener.postMessage(window.oauthData, '*');
            } else {
              console.log('OpenMemo: No opener window available for postMessage');
            }
          } catch (error) {
            console.error('OpenMemo: Failed to send postMessage:', error);
          }
          
          // Auto-close after a longer delay to ensure extension processing
          setTimeout(() => {
            console.log('OpenMemo: Auto-closing callback window');
            try {
              window.close();
            } catch (error) {
              console.log('OpenMemo: Could not close window automatically');
            }
          }, 8000); // Increased from 3 seconds to 8 seconds
          
          // Also dispatch a custom event for content script
          try {
            const event = new CustomEvent('oauthSuccess', {
              detail: window.oauthData
            });
            document.dispatchEvent(event);
            console.log('OpenMemo: Dispatched oauthSuccess event');
          } catch (error) {
            console.error('OpenMemo: Failed to dispatch custom event:', error);
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('chrome-extension://callback?error=callback_failed');
  }
});

// POST /api/auth/:provider/callback - Exchange authorization code for tokens (PKCE)
router.post('/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, codeVerifier } = req.body;
    const prisma = (req as any).prisma;

    if (!code || !codeVerifier) {
      return res.status(400).json({ error: 'Code and code verifier are required' });
    }

    let accessToken: string;
    let userData: any;

    switch (provider) {
      case 'github':
        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }, {
          headers: { Accept: 'application/json' }
        });

        accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
          return res.status(400).json({ error: 'Failed to get access token from GitHub' });
        }

        // Get user data from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
          headers: { Authorization: `token ${accessToken}` }
        });

        userData = userResponse.data;

        // Get user email if not public
        let email = userData.email;
        if (!email) {
          const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `token ${accessToken}` }
          });
          const primaryEmail = emailResponse.data.find((e: any) => e.primary);
          email = primaryEmail?.email;
        }

        if (!email) {
          return res.status(400).json({ error: 'Could not get email from GitHub' });
        }

        userData.email = email;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported provider' });
    }

    // Create or update user in database
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (user) {
      // Update existing user
      const updateData: any = {
        name: userData.name || userData.login,
        githubId: provider === 'github' ? userData.id.toString() : user.githubId,
        avatarUrl: userData.avatar_url,
      };

      // Store GitHub access token for repository operations
      if (provider === 'github') {
        updateData.githubToken = accessToken;
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    } else {
      // Create new user
      const createData: any = {
        email: userData.email,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
      };

      if (provider === 'github') {
        createData.githubId = userData.id.toString();
        createData.githubToken = accessToken; // Store GitHub access token
      }

      user = await prisma.user.create({ data: createData });

      // For new GitHub users, set up their memory repository
      if (provider === 'github') {
        try {
          const { GitHubService } = await import('../services/githubService');
          const githubService = new GitHubService(accessToken);
          const repoInfo = await githubService.createMemoryRepository(user.id);
          
          // Update user with repository information
          await prisma.user.update({
            where: { id: user.id },
            data: {
              memoryRepoOwner: repoInfo.owner,
              memoryRepoName: repoInfo.repo,
            },
          });
          
          console.log(`Created memory repository for new user ${user.id}: ${repoInfo.owner}/${repoInfo.repo}`);
        } catch (repoError) {
          console.error('Failed to create memory repository for new user:', repoError);
          // Don't fail authentication if repository creation fails
        }
      }
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, email: user.email, provider },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '90d' }
    );

    res.json({
      token,
      refreshToken,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      }
    });
  } catch (error) {
    console.error('OAuth token exchange error:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// GET /api/auth/verify - Verify token validity
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const prisma = (req as any).prisma;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ valid: true, userId: user.id });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

// GET /api/auth/me - Get current user from JWT token
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const prisma = (req as any).prisma;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { memories: true }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const prisma = (req as any).prisma;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Optionally generate new refresh token for rotation
    const newRefreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '90d' }
    );

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
      tokenType: 'Bearer'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/revoke - Revoke tokens (logout)
router.post('/revoke', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // In a production environment, you would add the token to a blacklist
    // For now, we just verify the token is valid and return success
    
    res.json({ success: true, message: 'Tokens revoked' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
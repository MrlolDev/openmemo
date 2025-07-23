# OpenMemo API

Backend REST API for the OpenMemo memory management system. For general project setup, see the [main README](../../README.md).

## Quick Start

```bash
cd apps/api
bun install
cp .env.example .env  # Configure with your API keys
bun run db:generate
bun run db:push
bun dev
```

## API Endpoints

### Authentication
- `POST /api/auth/github/url` - Get GitHub OAuth URL
- `POST /api/auth/github/callback` - Handle OAuth callback
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token validity

### Memory Management
- `GET /api/memories` - Load memories with optional query and automatic extraction
- `POST /api/memories` - Create single memory
- `POST /api/memories/bulk` - Create multiple memories
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `GET /api/memories/usage-stats` - Get usage statistics

## Key Features

### Hybrid Search System
1. **Vector Search** (Primary): Semantic similarity using AI embeddings
2. **AI Search** (Fallback): Groq AI-powered relevance detection
3. **Text Search** (Last Resort): Simple content matching

### AI-Powered Operations
- **Automatic Categorization**: Using Moonshot AI (Kimi K2 Instruct) model
- **New Memory Detection**: Automatically extracts memories from user queries
- **Duplicate Prevention**: Smart detection to avoid saving duplicate information
- **Bulk Processing**: Parallel AI operations for efficiency

### Security & Authentication
- JWT authentication with GitHub OAuth 2.0
- Rate limiting: 100 requests per 15 minutes per IP
- User access validation on all operations
- CORS configuration for extension and web app origins

## Development Commands

```bash
# Database management
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema to database
bun run db:studio      # Open Prisma Studio

# Development
bun dev                # Start development server
bun run build          # Build TypeScript
bun run start          # Start production server
```

## Technology Stack

- Express.js with TypeScript
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- JWT with GitHub OAuth 2.0
- Moonshot AI (Kimi K2 Instruct) via Groq API
- In-memory vector database for semantic search
- Rate limiting and CORS middleware

## Response Format

All endpoints return standardized JSON responses with appropriate HTTP status codes. Memory search includes metadata about search type, response time, and any new memories detected/saved.

## Deployment

Set `NODE_ENV=production` and use PostgreSQL for production. Ensure all environment variables are properly configured and consider using PM2 for process management.
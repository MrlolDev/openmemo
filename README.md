# OpenMemo

Universal AI Memory Integration - Store, categorize, and intelligently access your memories across ChatGPT, Claude, Perplexity, Gemini, DeepSeek, T3.chat, Grok, and Delphi AI.

OpenMemo is a 100% open-source AI memory integration tool that brings ChatGPT-style memory functionality to multiple AI platforms. Built with modern web technologies and a focus on user privacy and data ownership.

**Fully Free & Donation-Supported**: OpenMemo is completely free to use and will always remain free. The project is sustained through community donations from users who find value in the tool.

## Features

- **Universal Memory System** - Access your memories across 8+ AI platforms
- **AI-Powered Search** - Find relevant memories using intelligent semantic search with Moonshot AI (Kimi K2 Instruct)
- **Platform-Native Design** - UI adapts to match each platform's design system
- **Secure Cloud Sync** - Store memories securely with GitHub OAuth authentication
- **Smart Categorization** - AI-powered automatic categorization with 14 specific categories
- **Real-time Sync** - Instant synchronization across all your devices
- **Cross-Platform** - Chrome extension + Web app for comprehensive management

## Tech Stack

- React 19 with TypeScript
- Tailwind CSS for styling
- Vite for extension bundling
- Next.js 15 with Turbopack for web app
- Express.js with TypeScript
- Prisma ORM with SQLite/PostgreSQL
- GitHub OAuth for authentication
- Moonshot AI (Kimi K2 Instruct) for intelligent memory operations
- Vector database for semantic search
- Turborepo for monorepo management
- Bun as package manager

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (package manager)
- Node.js 18+
- GitHub account (for OAuth)
- [Groq API key](https://groq.com) (for AI features - supports Moonshot AI models)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MrlolDev/openmemo.git
   cd openmemo
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` files in each app directory and configure with your API keys

4. Start development servers:
   ```bash
   bun dev  # Start all applications
   ```

### Chrome Extension Setup

1. Build the extension:

   ```bash
   cd apps/extension && bun run build
   ```

2. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `apps/extension/dist` folder

## Roadmap

### Platform Support

> **Note:** Platforms are sorted by current priority. If you'd like to suggest support for a new platform, please [open an issue](https://github.com/MrlolDev/openmemo/issues) on GitHub!

- [x] ChatGPT
- [x] Claude
- [x] T3 Chat
- [x] DeepSeek
- [x] Grok
- [ ] Perplexity - WIP
- [ ] Gemini - WIP
- [ ] Delphi - WIP
- [ ] Groq
- [ ] Qwen
- [ ] Kimi
- [ ] Copilot
- [ ] Poe
- [ ] Le Chat
- [ ] YouChat
- [ ] Meta AI - Mayeb?
- [ ] HuggingChat
- [ ] Pi
- [ ] C.ai
- [ ] Bing
- [ ] Replika

### Core Features

- [x] Memory storage and retrieval
- [x] AI-powered categorization (14 categories)
- [x] Semantic search with vector database
- [x] GitHub OAuth authentication
- [x] Cross-platform synchronization
- [x] Bulk memory import/export
- [x] Automatic duplicate detection
- [x] Context-aware memory loading
- [x] Platform-native UI integration
- [x] Chrome extension popup interface
- [ ] Web dashboard application
- [ ] Memory sharing and collaboration
- [ ] Advanced filtering and sorting
- [ ] Memory analytics and insights
- [ ] API webhooks and integrations
- [ ] Mobile app (iOS/Android)

### AI Capabilities

- [x] Automatic memory categorization
- [x] Semantic similarity search
- [x] Context-aware memory extraction
- [x] Intelligent duplicate prevention
- [x] Bulk processing with parallel AI operations
- [ ] Memory summarization
- [ ] Conversation context analysis
- [ ] Predictive memory suggestions
- [ ] Multi-language support
- [ ] Custom AI model integration

## Privacy & Security

- **Data Ownership**: All your data belongs to you
- **GitHub OAuth**: Secure authentication without storing passwords
- **Local Storage**: Extension data stored locally in Chrome
- **Encrypted Transit**: All API communications over HTTPS
- **No Tracking**: No analytics or user behavior tracking
- **Open Source**: Complete transparency - audit the code yourself
- **Smart Duplicate Detection**: AI prevents saving duplicate memories automatically

## Development

### Available Scripts

**Root level:**

- `bun dev` - Start all development servers
- `bun build` - Build all applications
- `bun lint` - Run ESLint across all apps
- `bun check-types` - Run TypeScript checking
- `bun format` - Format code with Prettier

For app-specific commands, see individual README files in each app directory.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper tests
4. Follow the coding standards: `bun lint` and `bun check-types`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**.

**What this means:**

- **You can**: Use, modify, and distribute this software for non-commercial purposes
- **You must**: Give appropriate credit to the original authors
- **You cannot**: Use this software for commercial purposes without permission
- **Share-alike**: If you remix or build upon this material, you must distribute under the same license

For commercial use, please contact the maintainers for licensing arrangements.

## Support the Project

OpenMemo is **completely free** and always will be. We believe in keeping AI memory tools accessible to everyone. If you find OpenMemo valuable, consider supporting the project:

- **Donations**: Help cover development costs and server expenses
- **Contributions**: Contribute code, report bugs, or suggest features
- **Sharing**: Tell others about OpenMemo to grow the community

Your support helps us maintain and improve OpenMemo for everyone. Every contribution, no matter how small, makes a difference in keeping this project alive and thriving.

## Team

**Leonardo** - [@mrloldev](https://twitter.com/mrloldev)  
Extension & Backend Development, Software Engineer [@Delphi](https://delphi.ai)

**Samuel** - [@disamdev](https://twitter.com/disamdev)  
Website & Marketing

## Support & Community

- **GitHub Issues**: [Report bugs and request features](https://github.com/MrlolDev/openmemo/issues)
- **Twitter**: [@mrloldev](https://twitter.com/mrloldev) for updates and announcements
- **GitHub**: [@MrlolDev](https://github.com/MrlolDev) for code and contributions

## Acknowledgments

- **Groq** for providing fast AI inference infrastructure
- **Moonshot AI** for the powerful Kimi K2 Instruct model
- **GitHub** for authentication infrastructure
- **Chrome Extension** community for excellent documentation
- **All contributors** who help make OpenMemo better

---

**Made with ❤️ by Leonardo and Samuel**

_OpenMemo is not affiliated with OpenAI, Anthropic, Google, or any AI platform. It's an independent tool built to enhance your AI experience._

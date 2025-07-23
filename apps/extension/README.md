# OpenMemo Extension

Chrome extension for universal AI memory integration. For general project information and setup, see the [main README](../../README.md).

## Extension-Specific Development

### Building the Extension

```bash
# Development build
bun run build

# Production build (for Chrome Web Store)
bun run build:prod

# Development server with hot reload
bun dev
```

### Loading in Chrome

1. Build the extension: `bun run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder


### Platform Integration

Each platform integration follows this pattern:

1. **Button Injection**: Adds "Load Memories" button to platform UI
2. **Context Detection**: Detects current conversation context
3. **Memory Loading**: Fetches relevant memories from API
4. **Text Insertion**: Inserts selected memories into platform composer


### Adding New Platforms

To add a new AI platform:

1. **Create content script**: `src/content-scripts/newplatform.ts`
2. **Add to manifest**: Update `public/manifest.json` with host permissions and content script
3. **Add to build**: Update `vite.config.ts` input configuration
4. **Test integration**: Verify button injection and memory loading works

### Configuration

Copy `.env.example` to `.env` and configure with your API settings.

### Chrome Web Store Preparation

For production release:

1. Build with `bun run build:prod`
2. Test in Chrome with `Load unpacked`
3. Zip the `dist` folder contents
4. Upload to Chrome Web Store Developer Dashboard

### Debugging

- **Extension Console**: Right-click extension icon → "Inspect popup"
- **Content Script Console**: Open browser DevTools on AI platform pages
- **Background Script**: Go to `chrome://extensions/` → Click extension details → Inspect background script


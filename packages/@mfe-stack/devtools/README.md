# @mfe-stack/devtools

Browser extension for debugging micro-frontend applications built with create-mfe-stack.

## Features

- **MFE Graph** - Visual representation of shell/remote architecture
- **State Inspector** - Real-time view of bridge states with JSON tree viewer
- **Event Log** - Log of cross-MFE events with timestamps
- **Remote List** - List of loaded remote modules with status

## Installation

### Development (Unpacked Extension)

1. Build the extension:

```bash
# From the monorepo root
pnpm install
pnpm --filter @mfe-stack/devtools build
```

2. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `packages/@mfe-stack/devtools/dist` folder

3. The extension will appear in your DevTools when inspecting localhost pages.

### Development Mode

For development with hot reload:

```bash
pnpm --filter @mfe-stack/devtools dev
```

Then reload the extension in Chrome after each build.

## Usage

1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Navigate to the "MFE Stack" tab
3. The panel will automatically detect and display:
   - All bridges created with `@mfe-stack/core`
   - State changes in real-time
   - Actions dispatched between micro-frontends
   - Loaded remote modules

## Enabling DevTools Hook

For the extension to detect your bridges, you need to enable the devtools hook in `@mfe-stack/core`:

```typescript
import { createBridge, enableDevtools } from '@mfe-stack/core';

// Enable devtools before creating bridges
enableDevtools();

const myBridge = createBridge({
  namespace: 'my-bridge',
  schema: MySchema,
  initialState: { /* ... */ },
});
```

## Requirements

- Chrome 88+ (Manifest V3 support)
- Applications using `@mfe-stack/core` ^0.1.0

## Panel Features

### Graph Tab
Displays a visual representation of all detected bridges and their relationships.

### State Tab
Shows the current state of each bridge in a collapsible JSON tree viewer. States update in real-time as your application runs.

### Events Tab
Logs all state changes, actions, and events with timestamps. Useful for debugging cross-MFE communication.

### Remotes Tab
Lists all loaded remote modules with their status (loaded/pending) and URLs.

## Dark Theme

The extension uses a dark theme that matches Chrome DevTools styling for a consistent debugging experience.

## License

MIT

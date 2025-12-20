# Devtools

`@mfe-stack/devtools` is a browser extension to inspect bridges, actions, and remotes.

## What it shows
- Bridges: namespaces, current state, action count.
- Actions: log of dispatched actions with payloads.
- Remotes: list of connected remotes and status.
- Events: event bus log (if used).

## How to enable
- Install the extension (load unpacked from packages/@mfe-stack/devtools/dist or build).
- Open browser DevTools → "MFE Stack" tab.
- Bridges register automatically when devtools hook is detected.

## Tips
- Use meaningful namespaces; they appear in the panel.
- Keep payloads serializable for easier inspection.
- For production, you can disable devtools injection by not loading the extension.

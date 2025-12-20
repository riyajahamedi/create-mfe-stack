# Devtools install (Chrome/Firefox)

## Chrome (load unpacked)
1) Build or use dist: `pnpm --filter @mfe-stack/devtools build` (outputs to `packages/@mfe-stack/devtools/dist`).
2) Open `chrome://extensions`.
3) Toggle **Developer mode**.
4) Click **Load unpacked** and select `packages/@mfe-stack/devtools/dist`.
5) Open DevTools → find the **MFE Stack** tab.

## Firefox (temporary add-on)
1) Build as above.
2) Open `about:debugging#/runtime/this-firefox`.
3) Click **Load Temporary Add-on** and choose `manifest.json` inside `packages/@mfe-stack/devtools/dist`.
4) Open DevTools → **MFE Stack** tab.

## Tips
- Use consistent versions across apps so devtools shows a single runtime per framework.
- If the tab does not appear, reload the page and reopen DevTools; ensure the extension is enabled.
- For production builds, remove/unload the extension if not desired by users.

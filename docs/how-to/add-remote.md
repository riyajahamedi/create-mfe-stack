# How to add a remote

Use the dev CLI for fastest setup; manual steps included for reference.

## Using the CLI (recommended)
```bash
mfe add checkout --framework=react --port=3003
# or
mfe add settings --framework=vue --port=3004
```
What it does:
- Creates `apps/<name>/` with Vite + federation config.
- Exposes `./App` by default.
- Adds the remote entry to the shell’s `remotes` map (port you provided).

After adding:
```bash
pnpm install
mfe dev
```

## Manual steps (if you prefer)
1) Create a Vite app (React or Vue) under `apps/<name>/`.
2) Configure federation in `vite.config.ts`:
   - `name: '<name>'`
   - `filename: 'remoteEntry.js'`
   - `exposes: { './App': './src/App.tsx' }` (or `.vue`)
3) Update shell `vite.config.ts` remotes map:
   ```ts
   remotes: {
     ...,
     <name>: 'http://localhost:<port>/assets/remoteEntry.js',
   }
   ```
4) Add a type declaration in the shell (e.g., `src/remotes.d.ts`):
   ```ts
   declare module '<name>/App' {
     const App: React.ComponentType;
     export default App;
   }
   ```
5) Run `pnpm install` and `mfe dev`.

## Common pitfalls
- Ports: make sure the port in the shell matches the remote dev server.
- Shared deps: keep React/Vue versions aligned; pin `@mfe-stack/*` consistently.
- Module path: `./App` must exist and be default-exported.

# FAQ

**Can I mix React and Vue remotes in one shell?**  Yes; keep shared deps aligned and configure remotes in `vite.config.ts`.

**Do I need to share all deps?**  No. Share core runtimes (React/Vue) and heavy libs you truly want singleton; keep app-specific deps local.

**How do I add a new remote?**  Use `mfe add <name> --framework react|vue --port <port>`, then `pnpm install` and `mfe dev`.

**Where do I put shared state?**  In a shared package (e.g., `packages/shared`) exporting bridges/helpers; import the same instance in every MFE.

**How do I debug state?**  Use `@mfe-stack/devtools` extension to inspect bridges/actions.

**Can I deploy remotes separately?**  Yes; update shell `remotes` URLs to the deployed origins and handle CORS/HTTPS.

**What about SSR?**  Current templates target client-side MFEs; SSR would need additional host wiring.

**How do I version @mfe-stack packages?**  Keep them in lockstep; publish together via tags or changesets.

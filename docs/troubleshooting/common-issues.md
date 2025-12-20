# Common issues

- Remote 404 in shell: ensure remote dev server is running and shell `remotes` URL matches port/host.
- Type errors importing remote: add/update shell `src/remotes.d.ts` with the remote module name.
- State not syncing: verify all MFEs import the same bridge from the shared package (no local copies).
- Zod validation errors: check payloads before `setState`; ensure schema defaults allow empty init.
- Duplicate React/Vue runtime: align dependency versions and mark them as shared in federation config.
- CORS in prod: allow shell origin on remote servers or serve from same origin.
- Port conflicts: change `server.port` in the remote and update shell `remotes` map accordingly.

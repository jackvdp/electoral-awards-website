# Zoom MCP setup

Status as of 12 July 2026: the Zoom plugin is installed and the token helper is ready. The one outstanding step is creating the Zoom app on the Zoom App Marketplace, which is waiting on permission. Once that app exists, follow "Remaining steps" below.

## Background

Zoom's MCP servers cannot use Claude Code's built-in `/mcp` OAuth login. That flow relies on dynamic client registration, where Claude Code registers itself with the service automatically, and Zoom's OAuth server does not support it (error: "Incompatible auth server: does not support dynamic client registration"). Zoom only accepts OAuth apps created manually in its App Marketplace.

The working route is Zoom's official Claude Code plugin, which bundles the Zoom MCP servers and reads a bearer token from the `ZOOM_MCP_ACCESS_TOKEN` environment variable. Zoom access tokens expire after about an hour, so `scripts/zoom-mcp-token.mjs` handles the sign-in once and then mints fresh tokens from the stored refresh token.

## What is already in place

- **Plugin installed**: `zoom-plugin` v1.1.3 from the `claude-plugins-official` marketplace, user scope. Bundles three Zoom MCP servers (main, Docs, Whiteboard) and skills such as `/zoom-plugin:setup-zoom-mcp`.
- **Token helper**: `scripts/zoom-mcp-token.mjs`. Commands: `init` (one-off browser authorisation), `token` (print a valid access token, auto-refreshing when under 10 minutes remain), `refresh`, `status`.
- **Credentials folder**: `~/.zoom-mcp/credentials.env` (chmod 600) with placeholders for the app's Client ID and Secret. Tokens are stored in `~/.zoom-mcp/tokens.json`. Nothing secret lives in the repo.

## Remaining steps (once permission is granted)

1. **Create the Zoom app**: [marketplace.zoom.us](https://marketplace.zoom.us) → Develop → Build App → **General App**, user-managed.
   - Redirect URL, exactly: `http://localhost:53682/oauth/zoom/callback`
   - Scopes:
     - `ai_companion:read:search`
     - `meeting:read:search`
     - `meeting:read:assets`
     - `cloud_recording:read:list_user_recordings`
     - `cloud_recording:read:content`
     - `docs:write:import`
     - `docs:read:export`
2. **Store the credentials**: copy the Client ID and Secret from the app's Basic Information page into `~/.zoom-mcp/credentials.env`.
3. **Authorise once**: from the repo root, run `node scripts/zoom-mcp-token.mjs init`. A Zoom sign-in opens in the browser; the token is stored locally.
4. **Export the token on shell startup**: add to `~/.zshrc`:

   ```bash
   if [ -f "$HOME/.zoom-mcp/tokens.json" ]; then
     export ZOOM_MCP_ACCESS_TOKEN="$(node "$HOME/Repos/electoral-awards-website/scripts/zoom-mcp-token.mjs" token --quiet 2>/dev/null)"
     export ZOOM_DOCS_MCP_ACCESS_TOKEN="$ZOOM_MCP_ACCESS_TOKEN"
   fi
   ```

5. **Restart your configured client from a fresh terminal**. The Zoom tools (`search_meetings`, `recordings_list`, transcripts, Docs) should then appear.

## Caveats

- If a session runs past the hour, Zoom tools start failing with auth errors. Open a new terminal (the profile hook refreshes the token) and restart the session.
- The Whiteboard MCP server stays disconnected unless its admin-level scopes and a `ZOOM_WHITEBOARD_MCP_ACCESS_TOKEN` are added. Skip unless needed.
- For meeting summaries and transcript search to return anything useful, Smart Recording and Meeting Summary must be enabled in the Zoom web portal (Admin → Account Management → Account Settings → AI Companion).

## Codex and other MCP clients

The token helper is client-independent. The plugin installation described above is specific to Claude Code and does not register servers in Codex. Once the Zoom app is authorised, obtain the server URLs from the official Zoom plugin configuration and add only the services you need to your local client config. Do not copy token values into tracked files.

For Codex, add a `[mcp_servers.zoom]` entry to `.codex/config.toml` with the main server's `url` and `bearer_token_env_var = "ZOOM_MCP_ACCESS_TOKEN"`. For Docs, use a separate `[mcp_servers.zoom_docs]` entry with its URL and `bearer_token_env_var = "ZOOM_DOCS_MCP_ACCESS_TOKEN"`. Export fresh tokens using the helper above before launching Codex, then inspect `/mcp`. The same expiry caveat applies. This route requires local authentication and has not been live-tested in Codex.

See [the shared MCP guide](../agent-support/mcp.md) for client setup and environment handling.

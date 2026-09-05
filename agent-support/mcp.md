# MCP connections

Model Context Protocol (MCP) connections belong to the client running the agent. A Claude user or project setting does not configure Codex. The repo provides equivalent, credential-free templates:

- `.mcp.json.example` for Claude Code, copied to the ignored `.mcp.json`.
- `.codex/config.toml.example` for Codex, copied to the ignored `.codex/config.toml`.

Copy only the server entries you need. If a destination already exists, merge entries by server name rather than replacing the file. Keep both examples in sync when adding or changing a service. These are setup templates, not automatically enabled connections.

## Service inventory

| Server | Used for | Authentication/setup |
| --- | --- | --- |
| `exa` | Speaker and audience research | Public MCP endpoint; account limits may apply |
| `hunter` | Work email discovery and verification | Export `HUNTER_API_KEY` |
| `firecrawl` | Scraping and structured extraction | Export `FIRECRAWL_API_KEY`; Node.js/npx runs the official MCP server |
| `mongodb` | Website data | Export `MDB_MCP_CONNECTION_STRING`; Node.js/npx runs the official MCP server |
| `neon` | Awards dashboard | Sign in to the correct Neon account via OAuth |
| `Canva` | Design work | Sign in to Canva via OAuth |
| `cloudflare-dns-analytics` | DNS analytics | Sign in to Cloudflare via OAuth; optional user-level service |
| Supabase | Website authentication/admin | Referenced in old local settings but no project server definition was present; configure separately if needed |
| Zoom | Meetings, transcripts, Docs | Optional, see [Zoom setup](../scripts/zoom-mcp-setup.md); app authorisation must be completed first |

The templates cover the seven defined services above. Firecrawl uses its official stdio server so its API key stays in an environment variable instead of a URL. MongoDB likewise receives its connection string through the environment. Keep credentials in your shell/secret manager, and launch the client with those variables available. Desktop clients launched outside that shell may need their own environment setup. Neither client automatically exports the app's `.env.local` as MCP environment variables.

## Codex

Create `.codex/config.toml` from the needed example entries, then trust the checkout when Codex prompts. Project configuration loads only for trusted projects. Run from that checkout:

```bash
codex mcp list
codex mcp login neon
codex mcp login Canva
# Only if using Cloudflare:
codex mcp login cloudflare-dns-analytics
```

Use `/mcp` in a session to inspect active tools and connection errors. Restart after changing environment variables. Codex uses `env_http_headers` to read Hunter's key and `env_vars` to forward credentials to stdio servers. Do not put Claude's `${VARIABLE}` syntax in Codex TOML; it is not general-purpose environment interpolation.

## Claude Code

Create `.mcp.json` from the needed example entries. Run `claude mcp list`, then use `/mcp` in Claude Code to approve project servers and authenticate OAuth services. Remove or reconcile duplicate entries in your local/user settings if you already configured these names there. Local settings can take precedence over the project's `.mcp.json`.

Claude expands `${VARIABLE}` placeholders from the environment. Leave unrelated permissions in `.claude/settings.local.json`; do not copy the old machine's broad permission history into shared configuration.

## Verifying a connection

Check server status and the available tool schemas in each client. Skill names such as `hunter / Email-Finder` describe the server and operation; clients may expose different prefixes or separators. Test access using a read-only operation for the intended account/database before running a workflow that changes data. A configured server is not evidence that authentication succeeded.

These templates have been checked structurally, but account logins and live service operations require local credentials. If a service is unavailable, use the skill's documented fallback and say what remains unavailable.

Sources: [Codex MCP configuration](https://developers.openai.com/codex/mcp/), [Claude MCP configuration](https://code.claude.com/docs/en/mcp), [MongoDB environment options](https://www.mongodb.com/docs/mcp-server/local-mcp/configuration/options/), [Firecrawl MCP server](https://github.com/mendableai/firecrawl-mcp-server).

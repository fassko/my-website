import { createCloudflareHandler } from "docusaurus-plugin-mcp-server/adapters";
import docs from "../../build/mcp/docs.json";
import searchIndexData from "../../build/mcp/search-index.json";

let cachedHandler = null;
let cachedBaseUrl = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/mcp")) {
      return new Response("Not found", { status: 404 });
    }

    const baseUrl = env?.DOCS_BASE_URL ?? "https://dev.flare.network/";

    if (!cachedHandler || cachedBaseUrl !== baseUrl) {
      cachedBaseUrl = baseUrl;

      cachedHandler = createCloudflareHandler({
        docs,
        searchIndexData,
        name: env?.MCP_SERVER_NAME ?? "flare-devhub",
        version: env?.MCP_SERVER_VERSION ?? "1.0.0",
        baseUrl,
      });
    }

    // Strip the /mcp prefix so the handler sees requests at "/"
    const stripped = new URL(request.url);
    stripped.pathname = url.pathname.replace(/^\/mcp/, "") || "/";
    const targetUrl = stripped.toString();

    let newRequest;

    if (request.method === "POST") {
      try {
        const body = await request.json();

        // Normalize a doc URL: strip trailing slashes so it matches the docId
        // keys produced by the Docusaurus build (trailingSlash: false).
        const stripTrailingSlash = (value) =>
          value.length > 1 ? value.replace(/\/+$/, "") : value;

        // Top-level url field (e.g. some direct requests)
        if (body?.url && typeof body.url === "string") {
          body.url = stripTrailingSlash(body.url);
        }

        // Nested url inside tools/call → docs_fetch arguments
        if (
          body?.method === "tools/call" &&
          body?.params?.arguments?.url &&
          typeof body.params.arguments.url === "string"
        ) {
          body.params.arguments.url = stripTrailingSlash(
            body.params.arguments.url,
          );
        }

        newRequest = new Request(targetUrl, {
          method: "POST",
          headers: request.headers,
          body: JSON.stringify(body),
        });
      } catch {
        // Non-JSON body — pass through unchanged.
        newRequest = new Request(targetUrl, request);
      }
    } else {
      newRequest = new Request(targetUrl, request);
    }

    return cachedHandler(newRequest);
  },
};

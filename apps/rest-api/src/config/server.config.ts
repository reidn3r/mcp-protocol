export const serverConfig = {
  modelConfig: {
    apiKey: process.env.GEMINI_API_KEY as string,
  },
  modelParams: {
    temperature: 0.5,
    topP: 1,
    topK: 3,
    maxOutputTokens: 512,
  },
  mcpServerParams: {
    // url: process.env.MCP_SERVER_URL as string,
    url: 'http://localhost:3031/mcp',
    requestParams: {
      jsonrpc: '2.0',
      method: 'tools/list',
      id: 1,
    },
    requestHeaders: {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    },
  },
};

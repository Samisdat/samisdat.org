#!/usr/bin/env node

/**
 * Chrome DevTools Protocol MCP Server
 * Allows Claude to inspect and interact with Chrome instances
 */

const CDP = require('chrome-remote-interface');
const { spawn } = require('child_process');
const readline = require('readline');
const os = require('os');

let protocol;
let chrome;
let target;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// MCP Protocol handlers
const handlers = {
  initialize: async () => ({
    protocolVersion: '2024-11-05',
    capabilities: {},
    serverInfo: {
      name: 'chrome-devtools-mcp',
      version: '1.0.0',
    },
  }),

  resources: {
    list: async () => ({
      resources: [
        {
          uri: 'chrome://devtools/pages',
          name: 'Chrome Open Pages',
          description: 'List of open pages in Chrome',
          mimeType: 'application/json',
        },
        {
          uri: 'chrome://devtools/dom',
          name: 'DOM Tree',
          description: 'Current DOM of the page',
          mimeType: 'text/html',
        },
        {
          uri: 'chrome://devtools/console',
          name: 'Console Logs',
          description: 'Recent console messages',
          mimeType: 'application/json',
        },
      ],
    }),

    read: async (uri) => {
      if (!protocol) {
        throw new Error('Not connected to Chrome');
      }

      if (uri === 'chrome://devtools/pages') {
        const targets = await CDP.List({ port: 9222 });
        return {
          contents: JSON.stringify(targets, null, 2),
          mimeType: 'application/json',
        };
      }

      if (uri === 'chrome://devtools/dom') {
        const doc = await protocol.DOM.getDocument();
        const html = await protocol.DOM.getOuterHTML({ nodeId: doc.root.nodeId });
        return {
          contents: html.outerHTML,
          mimeType: 'text/html',
        };
      }

      if (uri === 'chrome://devtools/console') {
        return {
          contents: JSON.stringify(consoleLogs, null, 2),
          mimeType: 'application/json',
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    },
  },

  tools: {
    list: async () => ({
      tools: [
        {
          name: 'inspect_page',
          description: 'Get information about the current page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'eval_js',
          description: 'Execute JavaScript in the page context',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'JavaScript code to execute',
              },
            },
            required: ['code'],
          },
        },
        {
          name: 'get_console_logs',
          description: 'Get recent console logs',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_dom',
          description: 'Get the DOM tree of the page',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_network_logs',
          description: 'Get network activity logs',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }),

    call: async (name, args) => {
      if (!protocol) {
        throw new Error('Not connected to Chrome');
      }

      switch (name) {
        case 'inspect_page': {
          const title = await protocol.Runtime.evaluate({
            expression: 'document.title',
          });
          const url = await protocol.Runtime.evaluate({
            expression: 'window.location.href',
          });
          return {
            content: [
              {
                type: 'text',
                text: `Title: ${title.result.value}\nURL: ${url.result.value}`,
              },
            ],
          };
        }

        case 'eval_js': {
          const result = await protocol.Runtime.evaluate({
            expression: args.code,
          });
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.result, null, 2),
              },
            ],
          };
        }

        case 'get_console_logs': {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(consoleLogs, null, 2),
              },
            ],
          };
        }

        case 'get_dom': {
          const doc = await protocol.DOM.getDocument();
          const html = await protocol.DOM.getOuterHTML({ nodeId: doc.root.nodeId });
          return {
            content: [
              {
                type: 'text',
                text: html.outerHTML,
              },
            ],
          };
        }

        case 'get_network_logs': {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(networkLogs, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    },
  },
};

let consoleLogs = [];
let networkLogs = [];

// Connect to Chrome
async function connectToChrome() {
  try {
    const targets = await CDP.List({ port: 9222 });
    const pageTarget = targets.find((t) => t.type === 'page');

    if (!pageTarget) {
      throw new Error('No open page found in Chrome');
    }

    protocol = await CDP({ target: pageTarget, port: 9222 });

    // Setup listeners
    protocol.Runtime.consoleAPICalled((message) => {
      consoleLogs.push({
        type: message.type,
        args: message.args,
        timestamp: new Date().toISOString(),
      });
    });

    protocol.Network.requestWillBeSent((params) => {
      networkLogs.push({
        method: params.request.method,
        url: params.request.url,
        headers: params.request.headers,
        timestamp: params.timestamp,
      });
    });

    // Enable domains
    await protocol.Runtime.enable();
    await protocol.Network.enable();
    await protocol.DOM.enable();
    await protocol.Log.enable();
  } catch (error) {
    console.error('Failed to connect to Chrome:', error.message);
    process.exit(1);
  }
}

// Read and process input
async function processInput() {
  for await (const line of rl) {
    try {
      const request = JSON.parse(line);
      let response;

      const [resource, method] = request.method.split('/');

      if (resource === 'initialize') {
        await connectToChrome();
        response = await handlers.initialize();
      } else if (handlers[resource]) {
        if (handlers[resource][method]) {
          response = await handlers[resource][method](request.params);
        } else {
          response = { error: `Unknown method: ${method}` };
        }
      } else {
        response = { error: `Unknown resource: ${resource}` };
      }

      console.log(JSON.stringify(response));
    } catch (error) {
      console.log(JSON.stringify({ error: error.message }));
    }
  }
}

// Start
processInput().catch(console.error);

process.on('exit', async () => {
  if (protocol) {
    await protocol.close();
  }
});

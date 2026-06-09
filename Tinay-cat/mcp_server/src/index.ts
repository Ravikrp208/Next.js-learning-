import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import recommendCatsTool, { getAllCatsTool } from "./tools/recommendCats.tool.js";

// Create server instance
const server = new McpServer({
  name: "tinay-cat",
  version: "1.0.0",
});

// register Tool
server.registerTool(
  "recommend_cats",
  {
    title: "recommend_cats",
    description: "Recommend best cat breed according to user preferences",
    inputSchema: z.object({
      kidsFriendly: z.boolean(),
      apartmentFriendly: z.boolean(),
    }),
  },
  async ({ kidsFriendly, apartmentFriendly }) => {
    const result = await recommendCatsTool(
      kidsFriendly,
      apartmentFriendly
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }
);

// 

server.registerTool(
  "get_all_cats",
  {
    title: "get_all_cats",
    description: "get all cat",
    inputSchema: z.object({}),
  },
  async () => { 
    const result = await getAllCatsTool();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }
);

// transport (IMPORTANT)
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("MCP server running ...");
   
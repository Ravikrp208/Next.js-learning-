import type { Request, Response } from "express";
import { getMcpClient } from "../services/mcp.service.ts";
import { generateAiResponse } from "../services/gemini.service.ts";

export const testMcpController = async (req: Request, res: Response) => {
  try {
    const client = await getMcpClient();

    const result = await client.callTool({
      name: "recommend_cats",
      arguments: {
        kidsFriendly: true,
        apartmentFriendly: false,
      },
    });

    const catsData = result.content[0].text;

    const prompt = `
Available cats:
${catsData}

Recommend the best cats from this data.
`;

    const aiResponse = await generateAiResponse(prompt);

    return res.json({
      success: true,
      catsData,
      aiResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "MCP or AI error",
      error,
    });
  }
};
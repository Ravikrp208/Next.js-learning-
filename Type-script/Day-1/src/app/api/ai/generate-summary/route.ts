import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/getCurrentUser";
import { generateText } from "../../../../lib/gemini";
import { GenerateSummaryRequest, GenerateSummaryResponse } from "../../../../types/ai.types";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as GenerateSummaryRequest;
    const { jobTitle, experienceSummary, skills = [] } = body;

    if (!jobTitle || !experienceSummary) {
      return NextResponse.json({ error: "Job title and experience summary are required" }, { status: 400 });
    }

    const prompt = `
      You are a professional resume writer. Write a compelling, high-impact 3-4 sentence professional summary
      for a candidate targeting a "${jobTitle}" position.
      Their experience: "${experienceSummary}".
      Key skills to highlight: ${skills.join(", ")}.
      
      Make it sound confident, direct, and action-oriented.
      
      Respond only with a JSON object of the following format:
      {
        "summary": "Compelling professional summary text."
      }
    `;

    const aiResponse = await generateText(prompt);
    if (!aiResponse) {
      return NextResponse.json({ error: "Failed to generate professional summary" }, { status: 500 });
    }

    try {
      const parsedData: GenerateSummaryResponse = JSON.parse(
        aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
      );
      return NextResponse.json(parsedData);
    } catch {
      const fallbackResponse: GenerateSummaryResponse = {
        summary: `Result-driven ${jobTitle} with a proven track record of success: ${experienceSummary}. Proficient in ${skills.slice(0, 5).join(", ")} and dedicated to delivering robust software architectures. Skilled at collaborating with cross-functional teams to build high-performance solutions.`
      };
      return NextResponse.json(fallbackResponse);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

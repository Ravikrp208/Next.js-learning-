import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/getCurrentUser";
import { generateText } from "../../../../lib/gemini";
import { GenerateSkillsRequest, GenerateSkillsResponse } from "../../../../types/ai.types";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as GenerateSkillsRequest;
    const { jobTitle, resumeSummary = "" } = body;

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert technical recruiter. Based on the target job title "${jobTitle}" and the applicant's summary: "${resumeSummary}",
      suggest a list of highly relevant skills that will help pass ATS filters.
      
      Suggest up to 8 technical skills and 5 soft skills.
      
      Respond only with a JSON object of the following format:
      {
        "technicalSkills": ["skill 1", "skill 2", ...],
        "softSkills": ["skill 1", "skill 2", ...]
      }
    `;

    const aiResponse = await generateText(prompt);
    if (!aiResponse) {
      return NextResponse.json({ error: "Failed to generate skills" }, { status: 500 });
    }

    try {
      const parsedData: GenerateSkillsResponse = JSON.parse(
        aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
      );
      return NextResponse.json(parsedData);
    } catch {
      const fallbackResponse: GenerateSkillsResponse = {
        technicalSkills: ["TypeScript", "React", "Next.js", "Node.js", "REST APIs", "Git", "Database Management"],
        softSkills: ["Problem Solving", "Communication", "Team Collaboration", "Agile Methodologies", "Critical Thinking"]
      };
      return NextResponse.json(fallbackResponse);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

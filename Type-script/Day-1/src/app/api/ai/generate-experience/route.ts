import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/getCurrentUser";
import { generateText } from "../../../../lib/gemini";
import { GenerateExperienceRequest, GenerateExperienceResponse } from "../../../../types/ai.types";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as GenerateExperienceRequest;
    const { company, position, keyKeywords = [], tone = "professional" } = body;

    if (!company || !position) {
      return NextResponse.json({ error: "Company and Position are required" }, { status: 400 });
    }

    const prompt = `
      You are an expert resume builder and professional career coach.
      Generate 3 to 4 impactful bullet points describing the work experience of a "${position}" at "${company}".
      The tone should be "${tone}".
      ${keyKeywords.length > 0 ? `Incorporate the following keywords: ${keyKeywords.join(", ")}.` : ""}
      Each bullet point should start with a strong action verb and focus on achievements and quantifiable results.
      
      Respond only with a JSON object of the following format:
      {
        "suggestedBulletPoints": ["bullet point 1", "bullet point 2", "bullet point 3"],
        "improvedDescription": "A summary paragraph describing the role."
      }
    `;

    const fallbackResponse: GenerateExperienceResponse = {
      suggestedBulletPoints: [
        `Collaborated with cross-functional teams at ${company} to deliver high-quality features as a ${position}.`,
        `Leveraged industry best practices to improve code quality and deployment efficiency.`,
        `Designed and implemented key system enhancements that improved user experience and system response times.`
      ],
      improvedDescription: `Served as a ${position} at ${company}, leading key initiatives and engineering systems to improve overall software delivery.`
    };

    const aiResponse = await generateText(prompt);
    if (!aiResponse) {
      return NextResponse.json(fallbackResponse);
    }

    try {
      const parsedData: GenerateExperienceResponse = JSON.parse(
        aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
      );
      return NextResponse.json(parsedData);
    } catch {
      return NextResponse.json(fallbackResponse);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

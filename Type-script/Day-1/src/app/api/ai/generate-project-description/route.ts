import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/getCurrentUser";
import { generateText } from "../../../../lib/gemini";
import { GenerateProjectDescriptionRequest, GenerateProjectDescriptionResponse } from "../../../../types/ai.types";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as GenerateProjectDescriptionRequest;
    const { title, technologies = [], keyFeatures = [] } = body;

    if (!title) {
      return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert resume writer. Write a professional description for a software project titled "${title}".
      ${technologies.length > 0 ? `The technologies used are: ${technologies.join(", ")}.` : ""}
      ${keyFeatures.length > 0 ? `Key features of the project include: ${keyFeatures.join(", ")}.` : ""}
      
      Generate 3 bullet points highlighting technical challenges, implementation details, and outcomes.
      Also write a brief 2-sentence summary of the project.
      
      Respond only with a JSON object of the following format:
      {
        "bulletPoints": ["bullet point 1", "bullet point 2", "bullet point 3"],
        "summary": "Brief summary of the project."
      }
    `;

    const fallbackResponse: GenerateProjectDescriptionResponse = {
      bulletPoints: [
        `Developed "${title}" using ${technologies.join(", ") || "modern technologies"}, enabling streamlined performance.`,
        `Implemented key modules like ${keyFeatures.join(", ") || "core service layer"} ensuring robust and secure user flows.`,
        `Optimized system components to enhance responsiveness and improve database query execution times.`
      ],
      summary: `Designed and built ${title}, a comprehensive solution leveraging ${technologies.join(", ") || "modern tech stack"} to address complex requirements.`
    };

    const aiResponse = await generateText(prompt);
    if (!aiResponse) {
      return NextResponse.json(fallbackResponse);
    }

    try {
      const parsedData: GenerateProjectDescriptionResponse = JSON.parse(
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

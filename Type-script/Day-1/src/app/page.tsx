"use client";

import { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("Full Stack Developer");
  const [skillsResponse, setSkillsResponse] = useState<{ technicalSkills: string[]; softSkills: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateSkills = async () => {
    setLoading(true);
    setError("");
    setSkillsResponse(null);

    try {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          resumeSummary: "Experienced developer building modern web apps",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate skills. Please ensure GEMINI_API_KEY is configured.");
      }

      const data = await response.json() as { technicalSkills: string[]; softSkills: string[] };
      setSkillsResponse(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", background: "linear-gradient(to right, #60a5fa, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 10px 0" }}>
          AI Resume Builder
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
          Day 1: TypeScript API Integration with Gemini AI
        </p>
      </div>

      <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", border: "1px solid #334155" }}>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#e2e8f0" }}>
            Target Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e: any) => setJobTitle(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#f8fafc", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
            placeholder="e.g., Frontend Engineer"
          />
        </div>

        <button
          onClick={handleGenerateSkills}
          disabled={loading}
          style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "none", background: "linear-gradient(to right, #3b82f6, #8b5cf6)", color: "#ffffff", fontSize: "1rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "transform 0.2s" }}
        >
          {loading ? "Generating Skills with Gemini..." : "Generate AI Skills Suggestions"}
        </button>

        {error && (
          <div style={{ marginTop: "20px", padding: "12px", borderRadius: "8px", backgroundColor: "#ef444420", border: "1px solid #ef4444", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {skillsResponse && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontSize: "1.3rem", color: "#38bdf8", marginBottom: "15px", borderBottom: "1px solid #334155", paddingBottom: "5px" }}>
              Suggested Skills (ATS Optimized)
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "#c084fc", marginBottom: "10px" }}>Technical Skills</h3>
                <ul style={{ paddingLeft: "20px", color: "#cbd5e1" }}>
                  {skillsResponse.technicalSkills.map((skill, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "1.1rem", color: "#fb7185", marginBottom: "10px" }}>Soft Skills</h3>
                <ul style={{ paddingLeft: "20px", color: "#cbd5e1" }}>
                  {skillsResponse.softSkills.map((skill, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

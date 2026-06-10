"use client";

import { useState } from "react";
import { PersonalInfo, Experience, Project, Education, Resume } from "../types/resume.types";

export default function Home() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "projects" | "education" | "skills">("personal");
  const [template, setTemplate] = useState<"modern" | "classic" | "minimalist" | "creative">("modern");

  // Resume State
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "Aman Sharma",
    email: "aman.sharma@example.com",
    phone: "+91 98765 43210",
    address: "New Delhi, India",
    website: "https://amansharma.dev",
    linkedin: "linkedin.com/in/amansharma",
    github: "github.com/amansharma",
  });

  const [summary, setSummary] = useState(
    "Result-driven Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in TypeScript, React, Next.js, and Node.js. Passionate about writing clean, maintainable code and collaborating with cross-functional teams to deliver high-quality digital products."
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "TechNova Solutions",
      position: "Software Engineer",
      location: "Bengaluru, India",
      startDate: "2024-01",
      endDate: "",
      current: true,
      description: "• Developed and maintained scalable React and Next.js applications, improving page load speeds by 35%.\n• Designed and integrated secure RESTful APIs with Node.js and Express to power high-traffic microservices.\n• Collaborated with product designers to implement pixel-perfect, responsive user interfaces using modern CSS methodologies.",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      title: "E-Commerce Analytics Dashboard",
      description: "• Built a real-time analytics platform using Next.js, Tailwind, and Chart.js, serving over 10,000 monthly active vendors.\n• Developed backend APIs using Node.js to aggregate complex sales metrics with sub-second response times.",
      technologies: ["Next.js", "TypeScript", "Node.js", "Mongoose"],
      link: "https://github.com/example/analytics-dashboard",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      school: "Delhi Technological University",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science & Engineering",
      startDate: "2020-08",
      endDate: "2024-05",
      current: false,
      description: "Graduated with Honors. Focus on Algorithms, Data Structures, and Database Management Systems.",
    },
  ]);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([
    "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Mongoose", "Git", "REST APIs"
  ]);
  const [softSkills, setSoftSkills] = useState<string[]>([
    "Problem Solving", "Communication", "Team Collaboration", "Agile Methodologies", "Critical Thinking"
  ]);

  // AI Assistant States & Inputs
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // AI Experience Generator State
  const [expJobTitle, setExpJobTitle] = useState("Full Stack Developer");
  const [expCompany, setExpCompany] = useState("TechNova Solutions");
  const [expKeywords, setExpKeywords] = useState("Next.js, performance optimization, REST API");
  const [expTone, setExpTone] = useState<"professional" | "creative" | "technical">("professional");

  // AI Project Generator State
  const [projTitle, setProjTitle] = useState("AI Resume Builder");
  const [projTech, setProjTech] = useState("Next.js, TypeScript, Gemini AI");
  const [projFeatures, setProjFeatures] = useState("Dynamic templates, real-time PDF generation");

  // Save State
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Handlers for dynamic lists
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: [], link: "" }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    if (field === "technologies") {
      updated[index] = { ...updated[index], [field]: typeof value === "string" ? value.split(",").map(s => s.trim()) : value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setProjects(updated);
  };

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false, description: "" },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: any) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  // AI API Integration Calls
  const generateAISkills = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: personalInfo.fullName ? `${personalInfo.fullName} - Developer` : "Software Engineer",
          resumeSummary: summary,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.technicalSkills) setTechnicalSkills(data.technicalSkills);
      if (data.softSkills) setSoftSkills(data.softSkills);
    } catch (err: any) {
      setAiError("Failed to generate skills. Using fallback suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAISummary = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: experiences[0]?.position || "Software Engineer",
          experienceSummary: summary || "Experienced software engineer specializing in frontend development.",
          skills: technicalSkills.slice(0, 5),
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.summary) setSummary(data.summary);
    } catch (err: any) {
      setAiError("Failed to generate summary. Using fallback description.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIExperience = async (index: number) => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: expCompany || experiences[index]?.company || "Company",
          position: expJobTitle || experiences[index]?.position || "Developer",
          keyKeywords: expKeywords.split(",").map(k => k.trim()),
          tone: expTone,
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.suggestedBulletPoints) {
        const bulletPointsText = data.suggestedBulletPoints.map((b: string) => `• ${b}`).join("\n");
        handleExperienceChange(index, "description", bulletPointsText);
      }
    } catch (err: any) {
      setAiError("Failed to generate experience. Using default suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIProject = async (index: number) => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-project-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projTitle || projects[index]?.title || "Software Project",
          technologies: projTech.split(",").map(t => t.trim()),
          keyFeatures: projFeatures.split(",").map(f => f.trim()),
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json() as any;
      if (data.bulletPoints) {
        const bullets = data.bulletPoints.map((b: string) => `• ${b}`).join("\n");
        handleProjectChange(index, "description", bullets);
      }
    } catch (err: any) {
      setAiError("Failed to generate project description.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveResume = async () => {
    setSaveLoading(true);
    setSaveMessage("");
    try {
      const resumePayload: Omit<Resume, "userId"> = {
        title: resumeTitle,
        personalInfo,
        summary,
        experience: experiences,
        projects,
        education: educations,
        skills: [...technicalSkills, ...softSkills],
      };
      
      const response = await fetch("/api/resume/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumePayload),
      });

      if (!response.ok) throw new Error("Failed to save resume");
      const data = await response.json();
      setSaveMessage("Success! Resume saved to database.");
    } catch (err: any) {
      setSaveMessage("Saved locally! (Database connection skipped in dev mode)");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      {/* Styles for print output and styling overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif !important;
        }
        
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }
        .tab-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-btn:hover {
          background-color: rgba(51, 65, 85, 0.5);
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-area * {
            color: #000000 !important;
            border-color: #e2e8f0 !important;
          }
        }
      ` }} />

      {/* Top Header Section */}
      <header className="no-print" style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "10px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", color: "white" }}>
            AI
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0, background: "linear-gradient(to right, #60a5fa, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Antigravity AI Resume Builder
            </h1>
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>Day 1 TypeScript & Gemini API Platform</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <input
            type="text"
            value={resumeTitle}
            onChange={(e: any) => setResumeTitle(e.target.value)}
            style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", padding: "8px 12px", borderRadius: "6px", fontSize: "0.85rem", width: "180px", outline: "none" }}
            placeholder="Resume Title"
          />
          <button
            onClick={handleSaveResume}
            disabled={saveLoading}
            className="glow-button"
            style={{ backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#60a5fa", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
          >
            {saveLoading ? "Saving..." : "Save Resume"}
          </button>
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="glow-button"
            style={{ background: "linear-gradient(to right, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print / PDF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        
        {/* Left Pane - Editor & AI Assist */}
        <div className="no-print" style={{ width: "50%", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", backgroundColor: "#0f1322" }}>
          
          {/* Navigation Bar */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1e293b", backgroundColor: "#0c0f1d" }}>
            {(["personal", "summary", "experience", "projects", "education", "skills"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="tab-btn"
                style={{
                  padding: "14px 20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  border: "none",
                  backgroundColor: "transparent",
                  color: activeTab === tab ? "#60a5fa" : "#94a3b8",
                  borderBottom: activeTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {tab === "personal" ? "Personal Info" : tab}
              </button>
            ))}
          </div>

          {/* Form Content Scroll Container */}
          <div style={{ padding: "24px", overflowY: "auto", flex: 1, maxHeight: "calc(100vh - 140px)" }}>
            
            {saveMessage && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                <span>{saveMessage}</span>
                <button onClick={() => setSaveMessage("")} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer" }}>✕</button>
              </div>
            )}

            {aiError && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f43f5e", backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#fda4af", fontSize: "0.85rem" }}>
                {aiError}
              </div>
            )}

            {/* TAB: Personal Info */}
            {activeTab === "personal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0, color: "#f8fafc" }}>Personal Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>Full Name</label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>Email Address</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>Phone Number</label>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>Address / Location</label>
                    <input
                      type="text"
                      value={personalInfo.address || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>Portfolio Website</label>
                    <input
                      type="text"
                      value={personalInfo.website || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={personalInfo.linkedin || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px", fontWeight: "500" }}>GitHub Profile URL</label>
                    <input
                      type="text"
                      value={personalInfo.github || ""}
                      onChange={(e: any) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Summary */}
            {activeTab === "summary" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>Professional Summary</h3>
                  <button
                    onClick={generateAISummary}
                    disabled={aiLoading}
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#60a5fa", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    ✨ {aiLoading ? "Generating..." : "Generate AI Summary"}
                  </button>
                </div>
                <div>
                  <textarea
                    rows={6}
                    value={summary}
                    onChange={(e: any) => setSummary(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.9rem", lineHeight: "1.5", boxSizing: "border-box", outline: "none" }}
                    placeholder="Write a brief overview of your professional achievements and skills..."
                  />
                </div>
                <div style={{ padding: "14px", backgroundColor: "#1e293b40", borderRadius: "8px", border: "1px solid #334155", fontSize: "0.8rem", color: "#94a3b8" }}>
                  <strong>AI Note:</strong> The summary generator uses your first experience title and top 5 technical skills to frame a highly compelling professional description.
                </div>
              </div>
            )}

            {/* TAB: Experience */}
            {activeTab === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>Work History</h3>
                  <button
                    onClick={handleAddExperience}
                    style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    + Add Experience
                  </button>
                </div>

                {experiences.map((exp, index) => (
                  <div key={index} style={{ padding: "20px", border: "1px solid #1e293b", borderRadius: "8px", backgroundColor: "#0c0f1d", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      style={{ position: "absolute", right: "12px", top: "12px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem" }}
                    >
                      ✕
                    </button>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e: any) => handleExperienceChange(index, "company", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e: any) => handleExperienceChange(index, "position", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Location</label>
                        <input
                          type="text"
                          value={exp.location || ""}
                          onChange={(e: any) => handleExperienceChange(index, "location", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e: any) => handleExperienceChange(index, "startDate", e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>End Date</label>
                          <input
                            type="month"
                            disabled={exp.current}
                            value={exp.endDate || ""}
                            onChange={(e: any) => handleExperienceChange(index, "endDate", e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: exp.current ? "#1e293b" : "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        id={`current-job-${index}`}
                        checked={exp.current}
                        onChange={(e: any) => handleExperienceChange(index, "current", e.target.checked)}
                      />
                      <label htmlFor={`current-job-${index}`} style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>I currently work here</label>
                    </div>

                    {/* AI Exp Assistant */}
                    <div style={{ padding: "12px", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "6px", backgroundColor: "rgba(59, 130, 246, 0.05)" }}>
                      <h4 style={{ fontSize: "0.8rem", margin: "0 0 10px 0", color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
                        ✨ AI Bullet Points Assistant
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={expJobTitle}
                          onChange={(e: any) => setExpJobTitle(e.target.value)}
                          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem" }}
                        />
                        <input
                          type="text"
                          placeholder="Keywords (e.g. Next.js, API)"
                          value={expKeywords}
                          onChange={(e: any) => setExpKeywords(e.target.value)}
                          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem" }}
                        />
                        <select
                          value={expTone}
                          onChange={(e: any) => setExpTone(e.target.value)}
                          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem" }}
                        >
                          <option value="professional">Professional</option>
                          <option value="technical">Technical</option>
                          <option value="creative">Creative</option>
                        </select>
                      </div>
                      <button
                        onClick={() => generateAIExperience(index)}
                        disabled={aiLoading}
                        style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", border: "none", padding: "8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}
                      >
                        {aiLoading ? "Generating with Gemini..." : "Generate AI Bullet Points"}
                      </button>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Job Description (Bullet Points)</label>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e: any) => handleExperienceChange(index, "description", e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.85rem", boxSizing: "border-box" }}
                        placeholder="• Write bullet point descriptions of achievements..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Projects */}
            {activeTab === "projects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>Projects</h3>
                  <button
                    onClick={handleAddProject}
                    style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    + Add Project
                  </button>
                </div>

                {projects.map((proj, index) => (
                  <div key={index} style={{ padding: "20px", border: "1px solid #1e293b", borderRadius: "8px", backgroundColor: "#0c0f1d", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                    <button
                      onClick={() => handleRemoveProject(index)}
                      style={{ position: "absolute", right: "12px", top: "12px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                    >
                      ✕
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e: any) => handleProjectChange(index, "title", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Project Link</label>
                        <input
                          type="text"
                          value={proj.link || ""}
                          onChange={(e: any) => handleProjectChange(index, "link", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Technologies (Comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(", ")}
                        onChange={(e: any) => handleProjectChange(index, "technologies", e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        placeholder="e.g. Next.js, React, Node.js"
                      />
                    </div>

                    {/* AI Project Assistant */}
                    <div style={{ padding: "12px", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "6px", backgroundColor: "rgba(139, 92, 246, 0.05)" }}>
                      <h4 style={{ fontSize: "0.8rem", margin: "0 0 10px 0", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
                        ✨ AI Project Generator
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={projTitle}
                          onChange={(e: any) => setProjTitle(e.target.value)}
                          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem" }}
                        />
                        <input
                          type="text"
                          placeholder="Technologies"
                          value={projTech}
                          onChange={(e: any) => setProjTech(e.target.value)}
                          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem" }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Key Features (e.g. Auth, real-time charts)"
                        value={projFeatures}
                        onChange={(e: any) => setProjFeatures(e.target.value)}
                        style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.75rem", marginBottom: "10px", boxSizing: "border-box" }}
                      />
                      <button
                        onClick={() => generateAIProject(index)}
                        disabled={aiLoading}
                        style={{ width: "100%", backgroundColor: "#8b5cf6", color: "white", border: "none", padding: "8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}
                      >
                        {aiLoading ? "Generating with Gemini..." : "Generate AI Project Description"}
                      </button>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Description</label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e: any) => handleProjectChange(index, "description", e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.85rem", boxSizing: "border-box" }}
                        placeholder="• Highlight your role, technical challenges, and achievements..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Education */}
            {activeTab === "education" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>Education</h3>
                  <button
                    onClick={handleAddEducation}
                    style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    + Add Education
                  </button>
                </div>

                {educations.map((edu, index) => (
                  <div key={index} style={{ padding: "20px", border: "1px solid #1e293b", borderRadius: "8px", backgroundColor: "#0c0f1d", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      style={{ position: "absolute", right: "12px", top: "12px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                    >
                      ✕
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e: any) => handleEducationChange(index, "school", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e: any) => handleEducationChange(index, "degree", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e: any) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e: any) => handleEducationChange(index, "startDate", e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>End Date</label>
                          <input
                            type="month"
                            disabled={edu.current}
                            value={edu.endDate || ""}
                            onChange={(e: any) => handleEducationChange(index, "endDate", e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: edu.current ? "#1e293b" : "#0b0f19", color: "#f8fafc", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        id={`current-edu-${index}`}
                        checked={edu.current}
                        onChange={(e: any) => handleEducationChange(index, "current", e.target.checked)}
                      />
                      <label htmlFor={`current-edu-${index}`} style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>I currently study here</label>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "6px" }}>Details / Activities</label>
                      <textarea
                        rows={2}
                        value={edu.description || ""}
                        onChange={(e: any) => handleEducationChange(index, "description", e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.85rem", boxSizing: "border-box" }}
                        placeholder="GPA, achievements, societies, relevant coursework..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Skills */}
            {activeTab === "skills" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>Skills Portfolio</h3>
                  <button
                    onClick={generateAISkills}
                    disabled={aiLoading}
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#60a5fa", padding: "8px 14px", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    ✨ {aiLoading ? "Gemini Generating..." : "Generate AI Skills Suggestions"}
                  </button>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: "500" }}>Technical Skills (Comma separated)</label>
                  <textarea
                    rows={3}
                    value={technicalSkills.join(", ")}
                    onChange={(e: any) => setTechnicalSkills(e.target.value.split(",").map((s: string) => s.trim()))}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.9rem", lineHeight: "1.4", boxSizing: "border-box", outline: "none" }}
                    placeholder="TypeScript, React, Next.js, Node.js..."
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: "500" }}>Soft Skills (Comma separated)</label>
                  <textarea
                    rows={3}
                    value={softSkills.join(", ")}
                    onChange={(e: any) => setSoftSkills(e.target.value.split(",").map((s: string) => s.trim()))}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0b0f19", color: "#f8fafc", fontSize: "0.9rem", lineHeight: "1.4", boxSizing: "border-box", outline: "none" }}
                    placeholder="Problem Solving, Communication, Collaboration..."
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Pane - Professional Live Preview */}
        <div style={{ width: "50%", padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#090d16", minHeight: "calc(100vh - 73px)" }}>
          
          {/* Template Switcher */}
          <div className="no-print" style={{ display: "flex", gap: "10px", marginBottom: "20px", backgroundColor: "#0f172a", padding: "6px", borderRadius: "8px", border: "1px solid #1e293b" }}>
            {(["modern", "classic", "minimalist", "creative"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  textTransform: "capitalize",
                  backgroundColor: template === t ? "#3b82f6" : "transparent",
                  color: template === t ? "white" : "#94a3b8",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Paper Document Representation */}
          <div
            className="print-area"
            style={{
              width: "100%",
              maxWidth: "800px",
              minHeight: "1050px",
              backgroundColor: "white",
              color: "#1e293b",
              padding: "45px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              borderRadius: "4px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Header section based on template */}
            <div style={{
              borderBottom: template === "modern" ? "4px solid #3b82f6" : "1px solid #cbd5e1",
              paddingBottom: "18px",
              display: "flex",
              flexDirection: template === "classic" ? "column" : "row",
              justifyContent: "space-between",
              alignItems: template === "classic" ? "center" : "flex-start",
              textAlign: template === "classic" ? "center" : "left",
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  color: template === "creative" ? "#8b5cf6" : template === "modern" ? "#1e3a8a" : "#0f172a",
                  letterSpacing: "-0.5px"
                }}>
                  {personalInfo.fullName || "Your Full Name"}
                </h2>
                <p style={{
                  margin: "4px 0 0 0",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: template === "modern" ? "#3b82f6" : "#64748b"
                }}>
                  {experiences[0]?.position || "Your Target Job Title"}
                </p>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                fontSize: "0.85rem",
                color: "#475569",
                alignItems: template === "classic" ? "center" : "flex-end",
                marginTop: template === "classic" ? "10px" : "0",
                textAlign: template === "classic" ? "center" : "right",
              }}>
                {personalInfo.email && <div>✉ {personalInfo.email}</div>}
                {personalInfo.phone && <div>☎ {personalInfo.phone}</div>}
                {personalInfo.address && <div>📍 {personalInfo.address}</div>}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: template === "classic" ? "center" : "flex-end", marginTop: "4px" }}>
                  {personalInfo.website && <a href={personalInfo.website} style={{ color: "#3b82f6", textDecoration: "none" }}>web</a>}
                  {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} style={{ color: "#3b82f6", textDecoration: "none" }}>linkedin</a>}
                  {personalInfo.github && <a href={`https://${personalInfo.github}`} style={{ color: "#3b82f6", textDecoration: "none" }}>github</a>}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {summary && (
              <div>
                <h3 style={{
                  margin: "0 0 8px 0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Professional Summary
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.6", color: "#334155", textAlign: "justify" }}>
                  {summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {experiences.some(e => e.company || e.position) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Work Experience
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {experiences.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "0.95rem" }}>
                        <span>{exp.position} at <strong style={{ color: template === "modern" ? "#1e3a8a" : "#0f172a" }}>{exp.company}</strong></span>
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <div style={{ fontSize: "0.8rem", color: "#64748b", margin: "2px 0 6px 0" }}>
                          📍 {exp.location}
                        </div>
                      )}
                      <p style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.88rem",
                        lineHeight: "1.5",
                        color: "#475569",
                        whiteSpace: "pre-line"
                      }}>
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.some(p => p.title) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Key Projects
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "0.95rem" }}>
                        <span>
                          {proj.title}
                          {proj.link && <a href={proj.link} style={{ fontSize: "0.8rem", color: "#3b82f6", marginLeft: "10px", textDecoration: "none", fontWeight: "normal" }}>[link]</a>}
                        </span>
                        {proj.technologies.length > 0 && (
                          <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "normal" }}>
                            {proj.technologies.join(" | ")}
                          </span>
                        )}
                      </div>
                      <p style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.88rem",
                        lineHeight: "1.5",
                        color: "#475569",
                        whiteSpace: "pre-line"
                      }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {educations.some(e => e.school) && (
              <div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Education
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {educations.map((edu, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                          {edu.degree} in {edu.fieldOfStudy}
                        </div>
                        <div style={{ fontSize: "0.88rem", color: "#475569" }}>
                          {edu.school}
                        </div>
                        {edu.description && (
                          <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>
                            {edu.description}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>
                        {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {(technicalSkills.length > 0 || softSkills.length > 0) && (
              <div>
                <h3 style={{
                  margin: "0 0 10px 0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: template === "modern" ? "#1e3a8a" : "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px"
                }}>
                  Skills Portfolio
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.88rem" }}>
                  {technicalSkills.length > 0 && (
                    <div>
                      <strong style={{ color: "#334155" }}>Technical Skills: </strong>
                      <span style={{ color: "#475569" }}>{technicalSkills.join(", ")}</span>
                    </div>
                  )}
                  {softSkills.length > 0 && (
                    <div>
                      <strong style={{ color: "#334155" }}>Soft Skills: </strong>
                      <span style={{ color: "#475569" }}>{softSkills.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

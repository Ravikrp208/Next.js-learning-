export interface GenerateExperienceRequest {
  company: string;
  position: string;
  keyKeywords?: string[];
  tone?: 'professional' | 'creative' | 'technical';
}

export interface GenerateExperienceResponse {
  suggestedBulletPoints: string[];
  improvedDescription: string;
}

export interface GenerateProjectDescriptionRequest {
  title: string;
  technologies: string[];
  keyFeatures?: string[];
}

export interface GenerateProjectDescriptionResponse {
  bulletPoints: string[];
  summary: string;
}

export interface GenerateSkillsRequest {
  jobTitle: string;
  resumeSummary?: string;
}

export interface GenerateSkillsResponse {
  technicalSkills: string[];
  softSkills: string[];
}

export interface GenerateSummaryRequest {
  jobTitle: string;
  experienceSummary: string;
  skills: string[];
}

export interface GenerateSummaryResponse {
  summary: string;
}

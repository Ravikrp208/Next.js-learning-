export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Resume {
  id?: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  summary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

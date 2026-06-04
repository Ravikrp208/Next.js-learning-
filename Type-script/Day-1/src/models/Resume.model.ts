import mongoose, { Schema, Document } from "mongoose";
import { Resume } from "../types/resume.types";

// Combine the typescript Resume type with mongoose Document
export interface ResumeDocument extends Omit<Resume, "id">, Document {}

const PersonalInfoSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  website: { type: String },
  linkedin: { type: String },
  github: { type: String }
}, { _id: false });

const EducationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String }
}, { _id: false });

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String, required: true }
}, { _id: false });

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String }
}, { _id: false });

const ResumeSchema = new Schema<ResumeDocument>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  personalInfo: { type: PersonalInfoSchema, required: true },
  education: [EducationSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  skills: [{ type: String }],
  summary: { type: String }
}, {
  timestamps: true
});

export const ResumeModel = mongoose.models.Resume || mongoose.model<ResumeDocument>("Resume", ResumeSchema);
export default ResumeModel;

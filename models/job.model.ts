import mongoose, { Document } from "mongoose";

export interface Job extends Document {
  companyName: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  jobDescription: string;
  skills: string;
  recruiterId: string;
  applicants: [
    {
      name: string;
      email: string;
      userId: string;
      status: "applied" | "selected" | "not selected";
    }
  ];
  createdAt: Date;
}

const jobSchema = new mongoose.Schema<Job>({
  companyName: {
    type: String,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  location: {
    type: String, // location as a string in the schema
  },
  experience: {
    type: String,
  },
  jobDescription: {
    type: String,
  },
  skills: {
    type: String,
  },
  recruiterId: {
    type: String,
  },
  applicants: [
    {
      name: { type: String },
      email: { type: String },
      userId: { type: String },
      status: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;

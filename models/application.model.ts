import mongoose, { Document } from "mongoose";

export interface Application extends Document {
  recuiterUserId: string;
  name: string;
  email: string;
  candidateUserId: string;
  status: "applied" | "selected" | "rejected";
  jobId: string;
  jobAppliedDate: Date;
  createdAt: Date;
}

const applicationSchema = new mongoose.Schema<Application>({
  recuiterUserId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  candidateUserId: {
    type: String,
  },
  status: {
    type: String,
  },
  jobId: {
    type: String,
  },
  jobAppliedDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;

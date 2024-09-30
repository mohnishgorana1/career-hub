import mongoose, { Document } from "mongoose";

export interface Feed extends Document {
  userId: string;
  userName: string;
  message: string;
  userRole: "candidate" | "recruiter";
  likes: [
    {
      reactorUserId: string;
      reactorUserName: string;
    }
  ];
  image: string;
  createdAt: Date;
}

const feedSchema = new mongoose.Schema<Feed>({
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  userRole: {
    type: String,
  },
  message: {
    type: String,
  },
  likes: [
    {
      reactorUserId: { type: String },
      reactorUserName: { type: String },
    },
  ],
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feed = mongoose.models.Feed || mongoose.model("Feed", feedSchema);

export default Feed;

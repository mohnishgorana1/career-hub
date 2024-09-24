import mongoose from "mongoose";

export interface Profile extends Document {
  userId: string;
  // clerkId: string;
  role: string;
  email: string;
  isPremiumUser: boolean;
  memberShipType: string;
  memberShipStartDate: string;
  memberSchipEndDate: string;
  recruiterInfo: {
    name: string;
    companyName: string;
    companyRole: string;
  };
  candidateInfo: {
    resume: string;
    name: string;
    currentCompany: string;
    currentJobLocation: string;
    preferredJobLocation: string;
    currentSalary: string;
    noticePeriod: string;
    skills: string;
    previousCompanies: string;
    totalExperience: string;
    college: string;
    collegeLocation: string;
    graduatedYear: string;
    githubProfile: string;
    linkedInProfile: string;
  };

  createdAt: Date;
}

const profileSchema = new mongoose.Schema<Profile>({
  userId: {
    type: String,
  },
  // clerkId: {
  //   type: String
  // },
  role: {
    type: String,
  },
  email: {
    type: String,
  },
  isPremiumUser: {
    type: Boolean,
  },
  memberShipType: {
    type: String,
  },
  memberShipStartDate: {
    type: String,
  },
  memberSchipEndDate: {
    type: String,
  },
  recruiterInfo: {
    name: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyRole: {
      type: String,
    },
  },
  candidateInfo: {
    name: {
      type: String,
    },
    currentJobLocation: {
      type: String,
    },
    preferredJobLocation: {
      type: String,
    },
    currentSalary: {
      type: String,
    },
    noticePeriod: {
      type: String,
    },
    skills: {
      type: String,
    },
    currentCompany: {
      type: String,
    },
    previousCompanies: {
      type: String,
    },
    totalExperience: {
      type: String,
    },
    college: {
      type: String,
    },
    collegeLocation: {
      type: String,
    },
    graduatedYear: {
      type: String,
    },
    githubProfile: {
      type: String,
    },
    linkedInProfile: {
      type: String,
    },
    resume: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;

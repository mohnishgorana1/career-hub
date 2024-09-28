
// RECRUITER

export const recruiterOnboardFormControls = [
  {
    componentType: "INPUT",
    name: "name",
    label: "Name",
    placeholder: "Enter your name",
  },
  {
    componentType: "INPUT",
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter your company name",
  },
  {
    componentType: "INPUT",
    name: "companyRole",
    label: "Company Role",
    placeholder: "Enter your company role",
  },
];

export const initialRecruiterFormData = {
  name: "",
  companyName: "",
  companyRole: "",
};

// CANDIDATE
export const candidateOnboardFormControls = [
  {
    label: "Resume",
    name: "resume",
    componentType: "FILE",
  },
  {
    label: "Name",
    name: "name",
    placeholder: "Enter your Name",
    componentType: "INPUT",
  },
  {
    label: "Current Company",
    name: "currentCompany",
    placeholder: "Enter your Current Company",
    componentType: "INPUT",
  },
  {
    label: "Current Job Location",
    name: "currentJobLocation",
    placeholder: "Enter your Current Job Location",
    componentType: "INPUT",
  },
  {
    label: "Preferred Job Location",
    name: "preferredJobLocation",
    placeholder: "Enter your Preferred Job Location",
    componentType: "INPUT",
  },
  {
    label: "Current Salary",
    name: "currentSalary",
    placeholder: "Enter your Current Salary",
    componentType: "INPUT",
  },
  {
    label: "Notice Period",
    name: "noticePeriod",
    placeholder: "Enter your Notice Period",
    componentType: "INPUT",
  },
  {
    label: "Skills",
    name: "skills",
    placeholder: "Enter your Skills",
    componentType: "INPUT",
  },
  {
    label: "Previous Companies",
    name: "previousCompanies",
    placeholder: "Enter your Previous Companies",
    componentType: "INPUT",
  },
  {
    label: "Total Experience",
    name: "totalExperience",
    placeholder: "Enter your Total Experience ",
    componentType: "INPUT",
  },
  {
    label: "College",
    name: "college",
    placeholder: "Enter your College ",
    componentType: "INPUT",
  },
  {
    label: "College Location",
    name: "collegeLocation",
    placeholder: "Enter your College Location ",
    componentType: "INPUT",
  },
  {
    label: "Graduated Year",
    name: "graduatedYear",
    placeholder: "Enter your Graduated Year ",
    componentType: "INPUT",
  },
  {
    label: "Linked in Profile",
    name: "linkedInProfile",
    placeholder: "Enter your Linkedin Profile Url ",
    componentType: "INPUT",
  },
  {
    label: "Github Profile",
    name: "githubProfile",
    placeholder: "Enter your Github Profile Url ",
    componentType: "INPUT",
  },
];

export const initialCandidateFormData = {
  resume: "",
  name: "",
  currentCompany: "",
  currentJobLocation: "",
  preferredJobLocation: "",
  currentSalary: "",
  noticePeriod: "",
  skills: "",
  previousCompanies: "",
  totalExperience: "",
  college: "",
  collegeLocation: "",
  graduatedYear: "",
  githubProfile: "",
  linkedInProfile: "",
};

export const initialCandidateAccountFormData = {
  name: "",
  currentJobLocation: "",
  preferedJobLocation: "",
  currentSalary: "",
  noticePeriod: "",
  skills: "",
  currentCompany: "",
  previousCompanies: "",
  totalExperience: "",
  college: "",
  collegeLocation: "",
  graduatedYear: "",
  linkedinProfile: "",
  githubProfile: "",
  resume: ""
};

export const postNewJobFormControls = [
  {
    label: "Company Name",
    name: "companyName",
    placeholder: "Company Name",
    componentType: "INPUT",
    disabled: true,
  },
  {
    label: "Title",
    name: "title",
    placeholder: "Job Title",
    componentType: "INPUT",
  },
  {
    label: "Type",
    name: "type",
    placeholder: "Job Type",
    componentType: "INPUT",
  },
  {
    label: "Location",
    name: "location",
    placeholder: "Job Location",
    componentType: "INPUT",
  },
  {
    label: "Experience",
    name: "experience",
    placeholder: "Required Experience",
    componentType: "INPUT",
  },
  {
    label: "Job Description",
    name: "jobDescription",
    placeholder: "Job Description",
    componentType: "INPUT",
  },
  {
    label: "Skills",
    name: "skills",
    placeholder: "Skills",
    componentType: "INPUT",
  },
];

export const initialPostNewJobFormData = {
  companyName: "",
  title: "",
  type: "",
  location: "",
  experience: "",
  jobDescription: "",
  skills: "",
};

export const filterMenusDataArray = [
  {
    id: "companyName",
    name: "Company Name",
  },
  {
    id: "title",
    name: "Title",
  },
  {
    id: "type",
    name: "Type",
  },
  {
    id: "location",
    name: "Location",
  },
];


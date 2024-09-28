interface FormControl {
  componentType:
    | "INPUT"
    | "FILE"
    | "TEXTAREA"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX"; // Supported component types
  name: string; // Name of the form control
  label?: string; // Optional label for controls
  placeholder?: string; // Placeholder text (for inputs)
  disabled?: boolean; // Whether the input is disabled
  value?: string; // Initial value for the input
}

interface CommonFormType {
  action?: () => void; // Form action URL
  formControls: FormControl[]; // Array of form controls
  buttonText: string; // Text for the button
  isButtonDisabled?: boolean; // Whether the button is disabled
  btnType?: "button" | "submit" | "reset"; // Button type (defaults to submit)
  formData?: { [key: string]: any }; // Object for form field values
  setFormData?: (data: { [key: string]: any }) => void; // Function to update form data
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // File input change handler
  isShowLoadingButton: boolean
}

interface CreateProfile {
  userId: string | undefined;
  role: string;
  email: string;
  isPremiumUser: boolean;
  recruiterInfo: { [key: string]: any };
}

interface Applicant {
  name: string;
  email: string;
  userId: string;
  status: string;
}

interface createNewJob {
  companyName: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  jobDescription: string;
  skills: string;
  recruiterId: string;
  applicants: Applicant[];
}

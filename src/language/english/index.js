// English language properties for Sign Up Modal
// Properties file format: key=value

const properties = {
  "signup.title": "Sign Up",
  "signup.fullName.label": "Full Name",
  "signup.fullName.placeholder": "Enter your full name",
  "signup.email.label": "Email",
  "signup.email.placeholder": "Enter your email",
  "signup.password.label": "Password",
  "signup.password.placeholder": "Create a password",
  "signup.confirmPassword.label": "Confirm Password",
  "signup.confirmPassword.placeholder": "Confirm your password",
  "signup.button.cancel": "Cancel",
  "signup.button.submit": "Sign Up",
  "signin.title": "Sign In",
  "signin.email.label": "Email",
  "signin.email.placeholder": "Enter your email",
  "signin.password.label": "Password",
  "signin.password.placeholder": "Enter your password",
  "signin.button.cancel": "Cancel",
  "signin.button.submit": "Sign In"
};

// Helper function to get a property value
export const getProperty = (key) => {
  return properties[key] || key;
};

// Export all properties
export default properties;


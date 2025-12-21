// Bengali language properties
// Properties file format: key=value

import brandProperties from "./brand";
import signinProperties from "./signin";
import signupProperties from "./signup";
import navigationProperties from "./navigation";

const properties = {
  ...signupProperties,
  ...signinProperties,
  ...brandProperties,
  ...navigationProperties
};

// Helper function to get a property value
export const getProperty = (key) => {
  return properties[key] || key;
};

// Export all properties
export default properties;


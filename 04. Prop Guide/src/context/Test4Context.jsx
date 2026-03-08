import { createContext } from "react";

// Step 1 - create context
const Test4Context = createContext();

// Step 2 - Create provider function - Import children prop and return that. In the retuen statement the return will be funcname+.Provider

export function Test4Provider({ children }) {
  const value = {
    name: "Mayank",
    role: "Developer",
    location: "India",
  };

  return (
    <Test4Context.Provider value={value}>{children}</Test4Context.Provider>
  );
}

export { Test4Context };

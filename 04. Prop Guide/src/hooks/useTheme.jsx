import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

// Step 4 from ThemeTogglr.jsx - Custom hook to use the theme context.
// We have used "useContext" to get the value from the context created. The error handling step is very important here, we need to make sure that the context is wrapped in a Context provider function.
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}

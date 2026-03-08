import { createContext, useState } from "react";

// Step 1 from ThemeToggler.jsx - Create the context
const ThemeContext = createContext();

// Step 2 from ThemeTogler.jsx - ThemeProvider component - The variable object value is accessible to every component which is wrapped inside the Provider function.
// In this example, we have shared 3 itesm accross the components, theme, toggleTheme method which udpates the value of the theme state, and finally a boolean value isDark.
// Also, the return statement is also inportant here, we have to follow the same syntax. i.e. "Context Name" + ".Provider", value is shared as props and children is in between.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Export the context for use in hooks
export { ThemeContext };

// Note - The ThemeContext is exported to hooks where we have create dour own cusotm hook to get the values of context.
// However, the ThemeProvider is exported to App.jsx where the component will be wrapped around the Context Provided funciton.

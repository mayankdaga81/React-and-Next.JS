// Comprehensive Notes on Context API in React
//
// Context API is React's built-in solution for sharing state between components without prop drilling.
// It's ideal for global data like themes, user auth, language settings, etc.
//
// Key Concepts:
// 1. createContext: Creates a context object.
// 2. Provider: Wraps components to provide context value.
// 3. useContext: Hook to consume context in components.
// 4. Custom Hooks: Often created for cleaner usage.
//
// Benefits:
// - Avoids passing props through multiple levels.
// - Cleaner code in complex apps.
// - Can be combined with props for local overrides.
//
// Best Practices:
// - Separate context into its own file.
// - Use custom hooks for type safety and error handling in its own file.
// - Provide default values or throw errors if used outside provider.
//
// In this file, we demonstrate theme toggling using Context API.
// The context is defined in ThemeContext.js, and hook is defined in the useTheme.jsx file and  we import the provider and hooks.

// Step 5 - Usage of context created, which we have done in this component.
import { useState } from "react";
import { useTheme } from "../hooks/useTheme.jsx";

function ThemeToggleButton() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button className="px-2 py-1 bg-blue-400 rounded-lg" onClick={toggleTheme}>
      {isDark ? "🌛" : "🌞"}
    </button>
  );
}

function ThemedCard({ title, children }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`${isDark ? " bg-dark-600 text-white" : "bg-white text-gray-800"}`}
    >
      <h3> {title}</h3>
      <div>{children}</div>
    </div>
  );
}

// Themed Button COmponent
function ThemedButton({ children, variant = "primary", onClick }) {
  const { isDark } = useTheme();

  const getButtonClasses = () => {
    if (variant === "primary") {
      return isDark
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-orange-500 hover:bg-blue-600 text-white";
    }
    if (variant === "secondary") {
      return isDark
        ? "bg-gray-700 hover:bg-gray-600 text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClasses()}`}
    >
      {children}
    </button>
  );
}

function ThemeToggler() {
  // Using the value of context here.
  const { isDark } = useTheme();
  const [clickCount, setClickCount] = useState(0);

  return (
    <section
      className={`
        p-8 rounded-xl shadow-lg transition-colors duration-300
        ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Theme Toggler</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
          <ThemeToggleButton />
        </div>
      </div>

      <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        This section demonstrates theme toggling using Context API and props.
        The theme state is shared across all child components without prop
        drilling.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThemedCard title="User Information">
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Name: John Doe
              <br />
              Email: john@example.com
              <br />
              Role: Developer
            </p>
            <div className="mt-4 flex gap-2">
              <ThemedButton
                variant="primary"
                onClick={() => setClickCount(clickCount + 1)}
              >
                Edit Profile
              </ThemedButton>
              <ThemedButton
                variant="secondary"
                onClick={() => setClickCount(clickCount + 1)}
              >
                Settings
              </ThemedButton>
            </div>
          </ThemedCard>

          <ThemedCard title="Statistics">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Clicks:</span>
                <span className="font-bold text-blue-500">{clickCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Theme:</span>
                <span className="font-bold">{isDark ? "Dark" : "Light"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-green-500">Active</span>
              </div>
            </div>
          </ThemedCard>
        </div>

        <ThemedCard title="Interactive Demo">
          <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Try clicking the buttons below to see how they adapt to the current
            theme:
          </p>
          <div className="flex flex-wrap gap-3">
            <ThemedButton
              variant="primary"
              onClick={() => setClickCount(clickCount + 1)}
            >
              Primary Action
            </ThemedButton>
            <ThemedButton
              variant="secondary"
              onClick={() => setClickCount(clickCount + 1)}
            >
              Secondary Action
            </ThemedButton>
            <ThemedButton variant="primary" onClick={() => setClickCount(0)}>
              Reset Counter
            </ThemedButton>
          </div>
        </ThemedCard>

        <div
          className={`
            p-4 rounded-lg border-l-4 transition-colors
            ${
              isDark
                ? "bg-blue-900 border-blue-500 text-blue-100"
                : "bg-blue-50 border-blue-500 text-blue-800"
            }
          `}
        >
          <h4 className="font-semibold mb-2">Why Context + Props?</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Avoids "prop drilling" through multiple component layers</li>
            <li>Makes theme accessible to any component in the tree</li>
            <li>Components can still receive other props normally</li>
            <li>
              Combines global state (context) with local configuration (props)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ThemeToggler;

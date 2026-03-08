// Till now, we were creating different files for every components and then we were importing it in the App.jsx file, however, with this project, what we want to suggest is that, we can have the code for the component in the same App.jsx file, and we can dircetly use that without importing.
// Do, whatever makes your code better.

// Note - When using maps with arrow function, after => make sure you write () rather than {}, as () returns automatically, whereas {} expects return statement explicitly.

import BasicProps from "./components/BasicProps.jsx";
import RefProps from "./components/RefProps.jsx";
import ChildrenProps from "./components/ChildrenProps.jsx";
import ComplexProps from "./components/ComplexProps.jsx";
import ThemeToggler from "./components/ThemeToggler.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useTheme } from "./hooks/useTheme.jsx";
import Test from "./Practice/Test.jsx";
import Test2 from "./Practice/Test2.jsx";
import Test3 from "./Practice/Test3.jsx";
import Test4 from "./Practice/Test4.jsx";
import { Test4Provider } from "./context/Test4Context.jsx";

function Navigation() {
  const isDark = true;

  const sections = [
    { id: "basic", label: "Basic Props", icon: "📦" },
    { id: "children", label: "Children Props", icon: "🔗" },
    { id: "Complex", label: "Complex Props", icon: "🖥️" },
    { id: "ref", label: "Ref Props", icon: "🧩" },
    { id: "theme", label: "Theme Props", icon: "📠" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 shadow-md transition-colors ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className=" max-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => (
            <button
              className={`px-4 py-2 rounded-lg font-medium bg-blue-600 text-white mr-2 mt-2 hover:bg-blur-800 cursor-pointer `}
              key={section.id}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { isDark } = useTheme;
  return (
    <>
      <div
        className={`min-h-screen ${isDark ? "bg-gray-800" : "bg-gradient-tobr from-blue-50 to-purple-50"}`}
      >
        <Navigation />
        <div className={`mx-auto px-4 py-8 text-white my-0`}>
          <header
            className={`text-center mb-12 tranition-colors ${isDark ? "text-white" : "text-gray-800"}`}
          >
            <h1 className="text-5xl font-bold mb-4"> React props explained</h1>
            <p
              className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              A comprehensive guide to understand props in React.
            </p>
          </header>
          <div className="space-y-8">
            <div id="basic" className="scroll-mt-200">
              <BasicProps />
            </div>
            <div id="basic" className="scroll-mt-200">
              <RefProps />
            </div>
            <div id="basic" className="scroll-mt-200">
              <ChildrenProps />
            </div>
            <div id="basic" className="scroll-mt-200">
              <ComplexProps />
            </div>
            <div id="basic" className="scroll-mt-200">
              <ThemeToggler />
            </div>
            <div id="basic" className="scroll-mt-200">
              <Test />
            </div>
            <div id="basic" className="scroll-mt-200">
              <Test2 />
            </div>
            <div id="basic" className="scroll-mt-200">
              <Test3 />
            </div>
            <div id="basic" className="scroll-mt-200">
              <Test4Provider>
                <Test4 />
              </Test4Provider>
            </div>
          </div>
          <footer
            className={`mt-12 text-center pb-8 transition-colors ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p className="text-sm">
              Made with ❤️ using Bun, Vite, React, and Tailwind CSS
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

// Step 3 from ThemeToggler.jsx ->
// Here, this is wrapped around <AppContent /> component, so the enitre application will have access to the context. If you want only a specific component should have acess, then we can do so by wrapping the <ThemeContainer/> around that.
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

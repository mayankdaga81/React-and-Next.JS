import "./App.css";
import Counter from "./components/Counter.jsx";

// Zustand is one of the state management library which makes the state management feel like nothing.
// We have seen context-API which is again a state management option, and similarly we ahve redux, redux-toolkti, and the best ne among all zustand

// Step to work with Zustand State Management -
// 1. Install - bun install zustand

function App() {
  return (
    <div>
      <div>Zustand</div>
      <Counter />
    </div>
  );
}

export default App;

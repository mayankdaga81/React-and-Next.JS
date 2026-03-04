import "./App.css";
import Card from "./components/Card";
import Feature from "./components/Feature.jsx";

function App() {
  return (
    <>
      <Feature />
      <div className="mx-80 my-5">
        <h1>Welcome to React with Mayank</h1>
        <div className="flex gap-4">
          <Card title="Buy JavaScript Course" />
          <Card title="Buy React.js Course" />
          <Card title="Buy Node.js Course" />
        </div>
      </div>
    </>
  );
}

export default App;

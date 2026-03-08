// Problem 2

import { useRef, forwardRef } from "react";

// Create a reusable component called CustomInput and use it inside a parent component.

// Requirements
// The parent component should render two CustomInput fields.
// Add two buttons in the parent:
// Focus First Input
// Focus Second Input
// Clicking each button should focus the respective input field inside the CustomInput component.
// The parent should be able to control the input focus even though the input is inside another component.

const CustomInput = forwardRef(({ placeholder }, ref) => {
  return (
    <div>
      <input
        className=" rounded-lg shadow-md px-2 py-2 text-gray-800 mb-2"
        type="text"
        placeholder={placeholder}
        ref={ref}
      />
    </div>
  );
});

CustomInput.displayName = "Custom Input";

function Test2() {
  const first = useRef(null);
  const second = useRef(null);

  function focus1() {
    first.current.focus();
  }
  function focus2() {
    second.current.focus();
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md ">
      <CustomInput placeholder="Enter input 1" ref={first} />
      <CustomInput ref={second} placeholder="Enter input 2" />
      <div className="flex gap-2">
        <button
          className="bg-blue-400 text-white-800 cursor-pointer px-4 py-2 rounded-lg shadow-md"
          onClick={focus1}
        >
          Focus Input 1
        </button>
        <button
          className="bg-blue-400 text-white-700 cursor-pointer px-4 py-2 rounded-lg shadow-md"
          onClick={focus2}
        >
          Focus Input 2
        </button>
      </div>
    </div>
  );
}

export default Test2;

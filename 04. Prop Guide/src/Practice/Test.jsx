// Problem 1
// Create a small component with:

// One text input
// Two buttons:
// Focus Input
// Clear Input

// Requirements
// Clicking Focus Input should move the cursor to the text input.
// Clicking Clear Input should empty the input field.
// Do not use useState to store the input value.

import { useRef } from "react";

function Test() {
  const inputRef = useRef(null);

  function addFocus() {
    inputRef.current.focus();
  }

  function clearInput() {
    inputRef.current.value = "";
  }

  return (
    <div className="">
      <label>ENter your input: </label>
      <input type="text" placeholder="ENter the text" ref={inputRef} />
      <div className="flex gap-2">
        <button
          className="bg-blue-400 text-white cursor-pointer px-4 py-2 rounded-lg shadow-md"
          onClick={addFocus}
        >
          Focus Input
        </button>
        <button
          className="bg-blue-400 text-white cursor-pointer px-4 py-2 rounded-lg shadow-md"
          onClick={clearInput}
        >
          Clear Input
        </button>
      </div>
    </div>
  );
}

export default Test;

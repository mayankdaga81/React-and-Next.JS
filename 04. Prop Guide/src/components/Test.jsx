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
    <div>
      <label>ENter your input: </label>
      <input type="text" placeholder="ENter the text" ref={inputRef} />
      <button onClick={addFocus}>Focus Input</button>
      <button onClick={clearInput}>Clear Input</button>
    </div>
  );
}

export default Test;

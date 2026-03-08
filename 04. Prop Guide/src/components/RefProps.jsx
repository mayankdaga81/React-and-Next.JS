// We do not use useRef props now, however we can have some older code bases where they might ahve used ref props, so we are learning this only for that reason.
// When you want a variable to remember some value, however you do not want that variable to re-render the data, in that case you use useRef
// Used, when we are managing focus, text-selection or media playback.
// We will use useRef and forwardRef - One will be passing the reference and the other one will be accepting the reference.

// forwardRef is a funciton, which again expects a function as input.
// Inside that function, after adding all the props, you have to add "ref" separately, outside the {}. We have done this in CustomInput function, where we ahve used forwardRef, inside that we have an arrow function, inside that we have added ref at the end, after {}.
// Input component which will accept the ref prop. - This is like we are setting up base for the code to accept ref. It will have forwardRef and in input, it will have ref, and notice the way we have added it in the argument part, where at the end, we ahve added it separately

// Whenever you are adding the forwardRef function, it is recommended to add a display name, as this will be very helpful when you are debugging something.
// It is not mandatory, but recommended.

// While caliing the component in the main return, we have to initialise the ref and then pass it just like we pass the props.

// ref normally works only with HTML elements like <input>, <div>, etc. If you try to attach a ref directly to a custom React component (function component), it will not work because React does not automatically pass the ref to the underlying DOM element.
// forwardRef solves this problem by allowing a parent component to pass a ref through a custom component to the actual DOM element inside it. In simple terms, it forwards the ref from the parent to the child’s DOM node, so the parent can perform actions like focus(), scrollIntoView(), etc.
// It is commonly used when creating reusable input components, form controls, or UI libraries where the parent still needs direct access to the DOM element.

// Note - the enrtire arrow funciton is inside forwardRef. Notice careefully the brackets, CustomInput = forwardRef(). Inside forwardRef, we have the entire arrow function.

import { useRef, forwardRef } from "react";

const CustomInput = forwardRef(({ label, placeholder, className }, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font0medium mb-2 ">{label}</label>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
});

CustomInput.displayName = "CustomInput";

function RefProps() {
  // You can have as many number of reference as you like.
  const inputRef = useRef(null);
  const secondInputRef = useRef(null);

  // whenever you attach the below functionality to anything, it will bring the focus to "inputRef"
  // InputRef.current will select the component which will have the "ref", and then we can use the focus() method, which will highlight the selected component with ref.
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // this one is for getting the value of the input from our form.
  // <inputRef>.current.value gives you the value present in the component with ref in it.
  const getInputValue = () => {
    if (inputRef.current) {
      alert(`Input value: ${inputRef.current.value}`);
    }
  };

  // The function below is for clearing the input -
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // This funciton brings the focus to the second input ref.
  const focusSecondInput = () => {
    secondInputRef.current?.focus();
  };

  // Till how we have seen how can we accept the reference, which is by using the 'CustomInput" function in our case.
  // We have also seen how can we define functionalities of the references created.
  // Now, to pass the reference, we will do that in the return function.
  return (
    <section className="p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-gray-800 font-bold">Ref Props</h2>
      <p className="text-gray-800">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis facere
        facilis nostrum suscipit amet soluta.
      </p>

      <div>
        <div>
          <h3 className="text-gray-800">Try it out</h3>
          <CustomInput
            ref={inputRef}
            label="First input with ref"
            placeholder="Type something"
            className="text-gray-800"
          />
          <CustomInput
            ref={secondInputRef}
            label="First input with ref"
            placeholder="Type something else..."
            className="text-gray-800"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={focusInput}
            >
              Focus first input
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={focusSecondInput}
            >
              Focus second input
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={getInputValue}
            >
              Get first input
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={clearInput}
            >
              Clear input
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RefProps;

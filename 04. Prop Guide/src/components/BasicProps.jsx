import { useState } from "react";

// Button
// Created a custom function Button, which can take the following items as input, and create different buttons based on the input props.
// Instead of having a different file, we have added the Button in the same BasicProps.jsx file to show that we do not need to create separate file always, we can create this in the same file, if we will refernce it in this file, however, if you think this can be used by some other componets, then creating a separate file would make sense.
// In the button funciton, we have used props to decide the class and chnage the look and feel, so with just 1 Button function, we have many variations. We can also set default values ot any props if required.

// BasicProps
// In this we have just added a lot of type of buttons.
function Button({ text, color, size, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium tranistion-all duration-300 
                ${size === "small" ? "text-sm px-2 py-1" : ""} 
                ${size === "large" ? "text-lg px-8 py-1" : ""}
                ${color === "primary" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""} 
                ${color === "secondary" ? "bg-gray-500 hover:bg-gray-600 text-white" : ""}
                ${color === "danger" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                ${color === "success" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
    >
      {text}
    </button>
  );
}

function BasicProps() {
  const [clickCount, setClickCount] = useState(0);
  return (
    <section className="p-8  bg-white rounded-xl shadow-2xl ">
      <h2 className="text-black font-bold">Basic Props</h2>
      <p className="text-black">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis corrupti
        repudiandae assumenda laudantium rem hic unde, praesentium culpa iusto
        maxime nulla vero accusamus animi voluptatibus vitae inventore dicta
        asperiores porro tempora maiores libero consequuntur delectus beatae.
        Corporis aperiam dolor sapiente obcaecati alias! Ratione explicabo,
        voluptates maxime numquam cum reprehenderit fugiat.
      </p>
      <div className="space-y-1 mt-4">
        <h3 className="text-black">Different colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            text="Primary Button"
            color="primary"
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Secondary Button"
            color="secondary"
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Danger Button"
            color="danger"
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Success Button"
            color="success"
            onClick={() => setClickCount(clickCount + 1)}
          />
        </div>
      </div>
      <div className="space-y-1 mt-4">
        <h3 className="text-black">Different sizes </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            text="Small"
            color="primary"
            size="small"
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Secondary Button"
            color="secondary"
            size="large"
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Danger Button"
            color="danger"
            disabled={true}
            onClick={() => setClickCount(clickCount + 1)}
          />
          <Button
            text="Success Button"
            color="success"
            onClick={() => setClickCount(clickCount + 1)}
          />
        </div>
      </div>
      <div className="p-4 mt-4 bg-gray-200 rounded-xl text-black">{`Click count: ${clickCount}`}</div>
    </section>
  );
}

export default BasicProps;

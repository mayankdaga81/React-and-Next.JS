import { useContext } from "react";
import { Test4Context } from "../context/Test4Context.jsx";

export function useTest4() {
  const context = useContext(Test4Context);

  if (!context) {
    throw new Error("Used Test 4 context outside the Provider.");
  }

  return context;
}

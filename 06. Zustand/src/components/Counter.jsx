import { useCounterStore } from "../store/counterStore.js";

function Counter() {
  // Here, we have 1 small issue, we have imported all the values together using useCounterStore(), and therefore if any of these values changes, the entire component will be re-rendered even if you are not using some value from these.
  // The fix for this is to call them separately using notifiers.
  // const count = useCounterStore((state)=>state.count)
  // Even this command has the zustand feature of () => ().

  const { count, increase, decrease, reset } = useCounterStore();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrease}>-</button>
      <button onClick={increase}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;

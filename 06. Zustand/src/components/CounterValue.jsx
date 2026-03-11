import { useCounterStore } from "../store/counterStore";

function CounterValue() {
  // The benefit of using this way of getting the counter value is that, it will render only the components where this count value is used, however if you would have imported the entire thing using useCounterStore() simply, then any value in the store when updated would re-render the component.
  const count = useCounterStore((state) => state.count);

  return <h2>Count: {count}</h2>;
}

export default CounterValue;

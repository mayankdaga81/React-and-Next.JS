# 12. Advanced Hooks

## 12.1 `useReducer` — "Redux for One Component"

Preferred over `useState` when: state is complex (multiple sub-values that change together), or the next state depends heavily on the previous one via distinct "actions" — makes state transitions explicit and testable.

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

If this looks exactly like a Redux slice — that's the point. Once you know Redux Toolkit ([05-Redux-Toolkit.md](05-Redux-Toolkit.md)), `useReducer` is nearly free to learn: same `(state, action) => newState` shape, just local instead of global, and no Immer (you must return new objects manually, or use Immer's `useImmerReducer` if desired).

**`useState` vs `useReducer` — when to pick which:**
| | useState | useReducer |
|---|---|---|
| Best for | Simple, independent values | Multiple related values, complex transitions |
| Update logic location | Inline at each call site | Centralized in one reducer function |
| Testability | N/A (trivial) | Reducer is a pure function — easy to unit test in isolation |

## 12.2 `useLayoutEffect` — Synchronous, Before Paint

Same signature as `useEffect`, but runs **synchronously after DOM mutations, before the browser paints**.

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipPosition(height); // must happen before paint to avoid visible flicker
}, []);
```

Use only when you need to **measure the DOM and synchronously adjust it before the user sees a flicker** (tooltips positioning, scroll restoration). Default to `useEffect` — `useLayoutEffect` blocks painting, hurting perceived performance if overused.

## 12.3 `useImperativeHandle` — Customize What a Ref Exposes

Used with `forwardRef` to expose a controlled, minimal API from a child instead of the raw DOM node.

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => {
      inputRef.current.value = "";
    },
  }));
  return <input ref={inputRef} {...props} />;
});

// parent: fancyRef.current.focus(); fancyRef.current.clear();
```

Rare in practice — most of the time just forwarding the raw DOM ref is enough.

## 12.4 `useTransition` — Mark Updates as Non-Urgent (Concurrent React)

Lets you keep the UI responsive during expensive re-renders by marking some state updates as low-priority ("transitions") that can be interrupted by more urgent updates (like typing).

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  function handleChange(e) {
    setQuery(e.target.value); // urgent — keep input responsive
    startTransition(() => {
      setResults(filterHugeList(e.target.value)); // non-urgent — can be deferred/interrupted
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

## 12.5 `useDeferredValue` — Defer Re-rendering Part of the UI

Similar goal to `useTransition` but for a _value_ rather than a state update you control — useful when the expensive part is a child you don't own the setter for.

```jsx
const deferredQuery = useDeferredValue(query);
// pass deferredQuery to an expensive list — it "lags behind" query during heavy renders, keeping input responsive
```

## 12.6 `useId` — Stable Unique IDs for Accessibility

Generates a stable unique ID, consistent between server and client render (important for SSR hydration matching) — use for linking labels/inputs (`htmlFor`/`id`) or ARIA attributes.

```jsx
function Field({ label }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

## 12.7 `useSyncExternalStore` — Subscribe to Non-React State

The hook state libraries (Redux, Zustand) actually use internally to safely subscribe a component to an external store (outside React) in a way that's concurrent-rendering-safe.

```js
const value = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

You'll rarely write this yourself — but knowing it exists (and that it's what `react-redux`'s `useSelector` uses under the hood) is a strong interview signal.

## 12.8 React 19 Additions (good to mention you're aware of, since this repo runs React 19)

- **`use()`** — a new way to read a Promise's or Context's value directly during render (works with Suspense for async data).
- **`useActionState`** — manages state for a form action (pending/result/error) tied to the new `<form action={...}>` support.
- **`useOptimistic`** — shows an optimistic UI update while an async action is in flight, automatically reverting on failure.
  These are cutting-edge/less commonly used yet in most production codebases still on established patterns (Redux Toolkit, react-hook-form) — know they exist, don't worry about mastering them yet.

---

## ⚠️ Common Mistakes

1. Reaching for `useReducer` for simple independent state — adds ceremony without benefit; `useState` is fine for that.
2. Using `useLayoutEffect` by default "to be safe" — it blocks painting; only use it when you specifically need pre-paint DOM measurement/adjustment.
3. Forgetting `useTransition`'s `isPending` doesn't block input — the _input_ update stays urgent; only the wrapped update is deferred.

## 🎤 Interview Questions

1. **When would you use `useReducer` over `useState`?** → When state has multiple related sub-values or complex transition logic, especially when the same shape of update needs to happen from many places (centralizing it in a reducer improves testability/readability).
2. **`useEffect` vs `useLayoutEffect`?** → `useEffect` runs asynchronously after paint (non-blocking); `useLayoutEffect` runs synchronously before paint (blocking, use only for DOM measurement/adjustment to avoid visual flicker).
3. **What does `useTransition` solve?** → Lets you mark a state update as low priority so React can keep the UI (e.g. text input) responsive while a big, expensive re-render happens in the background.
4. **What is `useSyncExternalStore` for?** → Safely subscribing a component to state that lives outside React (e.g. a Redux/Zustand store) in a way that's compatible with concurrent rendering.
5. **Why does `useId` exist instead of just generating a random ID?** → To guarantee the ID is stable and matches between server-rendered and client-hydrated markup, avoiding hydration mismatches.

## ✅ Practice Task

Rebuild the counter from [05-Redux-Toolkit.md](05-Redux-Toolkit.md)'s practice task as a **local-only** `useReducer` version (increment/decrement/incrementByAmount/reset actions) — notice how similar the reducer function is to a Redux Toolkit slice's logic, just without Immer and without a global store.

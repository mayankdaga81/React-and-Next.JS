# 2. Core Hooks You'll Use Every Week

> `useState` fundamentals already covered in [01-JSX-Components-Props-State.md](01-JSX-Components-Props-State.md). This file focuses on `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext` — the rest of your daily toolkit.

## Rules of Hooks (applies to ALL hooks, memorize this)

1. Only call hooks at the **top level** of a component or custom hook — never inside loops, conditions, or nested functions.
2. Only call hooks from **React function components** or **custom hooks** (functions starting with `use`).
3. Hook call **order must be identical on every render** — React tracks hooks by call order internally, not by name.

---

## 2.1 `useEffect` — Side Effects

An "effect" is anything that reaches **outside** React's rendering (network calls, subscriptions, timers, manually touching the DOM, localStorage, analytics).

```js
useEffect(() => {
  // runs AFTER the DOM has been updated / painted
  return () => {
    // cleanup — runs before the next effect run, and on unmount
  };
}, [dependencies]);
```

### Dependency array behavior (the most-asked interview detail)

| Dependency array | Runs                                                       |
| ---------------- | ---------------------------------------------------------- |
| Omitted entirely | After **every** render (rarely what you want)              |
| `[]`             | Once, after the **first** render only (mount)              |
| `[a, b]`         | After first render, then again whenever `a` or `b` changes |

### Data fetching example (the real-world use case)

```jsx
useEffect(() => {
  let cancelled = false;
  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      if (!cancelled) setUser(data);
    } catch (err) {
      if (!cancelled) setError(err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }
  load();
  return () => {
    cancelled = true;
  }; // avoid setting state after unmount / race condition
}, [id]);
```

⚠️ In a real codebase with Redux Toolkit, you'll mostly replace this pattern with **RTK Query** (see [06-Data-Fetching-and-Async](06-Data-Fetching-and-Async.md)) — but you must still know how to write this by hand, it's asked constantly in interviews.

### Cleanup example (subscriptions/listeners)

```jsx
useEffect(() => {
  const handler = (e) => setWidth(window.innerWidth);
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
```

### Common mistakes

- Missing dependencies → stale values used inside the effect (ESLint's `react-hooks/exhaustive-deps` catches this — don't disable it blindly).
- Forgetting cleanup → memory leaks, duplicate listeners, "setState on unmounted component" warnings.
- Using `useEffect` for something that could just be computed during render (derived state) or handled in an event handler instead.
- Object/array/function literals in the dependency array cause the effect to re-run every render (new reference each time) — wrap them in `useMemo`/`useCallback` or move them inside the effect.

---

## 2.2 `useRef` — Persistent Mutable Value That Doesn't Trigger Re-render

Two main use cases:

### (a) Accessing a DOM node directly

```jsx
function TextInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}
```

### (b) Storing a mutable value across renders WITHOUT causing a re-render

```jsx
function Timer() {
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
}
```

Or tracking previous value / render count / "did I already fetch this" flags without re-rendering.

**Key distinction vs `useState`:** changing `ref.current` does **not** re-render the component; changing state **does**.

---

## 2.3 `useMemo` — Memoize an Expensive Computed Value

```js
const total = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [cart]);
```

- Recomputes only when a dependency changes; otherwise returns the cached value.
- Use for genuinely expensive calculations (heavy loops, large array transforms) or to keep a stable object/array **reference** (useful to avoid re-running a child's effect or re-rendering a memoized child).
- **Don't overuse** — memoizing trivial calculations adds overhead for no benefit. Profile first (see [08-Performance-Optimization](08-Performance-Optimization.md)).

---

## 2.4 `useCallback` — Memoize a Function Reference

```js
const handleAdd = useCallback((item) => {
  setCart((prev) => [...prev, item]);
}, []);
```

- Without it, a new function is created on every render — which breaks `React.memo` on a child that receives this function as a prop (the child re-renders anyway because the prop "changed").
- `useCallback(fn, deps)` is literally `useMemo(() => fn, deps)`.
- Only worth it when passing callbacks to **memoized children** or as a dependency of another hook (`useEffect`) — not needed for every handler.

---

## 2.5 `useContext` — Read a Context Value

```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
```

Full deep-dive (when to use vs Redux Toolkit, performance pitfalls) is in [11-Context-API.md](11-Context-API.md) — it's Tier 2 because your job uses Redux Toolkit for global state, but `useContext` itself is used often enough (e.g. reading a `ThemeProvider`, `AuthProvider` set up by someone else) that it belongs here as a hook you must be fluent in reading, even if you rarely author new contexts.

---

## ⚠️ Common Mistakes (all hooks)

1. Conditionally calling a hook (`if (x) { useState() }`) — breaks the call-order rule → runtime error.
2. Missing/incorrect dependency arrays in `useEffect`/`useMemo`/`useCallback`.
3. Using `useMemo`/`useCallback` everywhere "for performance" without measuring — adds complexity for no gain.
4. Using `useRef` for something that should be state (UI won't update because ref changes don't trigger renders).
5. Not cleaning up subscriptions/timers/listeners in `useEffect`.

---

## 🎤 Interview Questions

1. **What are the Rules of Hooks and why do they exist?** → Top-level only, same order every render — because React matches hooks to internal state by call order/index, not name.
2. **Difference between `useMemo` and `useCallback`?** → `useMemo` memoizes a _value_; `useCallback` memoizes a _function reference_ (sugar over `useMemo`).
3. **When does `useEffect` run relative to painting?** → After the browser has painted (async, non-blocking) — vs `useLayoutEffect` which runs synchronously _before_ paint (see file 12).
4. **Why would you use `useRef` instead of `useState` for a value?** → When changing it should NOT cause a re-render (timers, DOM nodes, previous-value tracking, mutable flags).
5. **What causes an effect to run on every render unintentionally?** → An inline object/array/function in the dependency array — new reference every render.
6. **How do you prevent a child wrapped in `React.memo` from re-rendering due to a callback prop?** → Wrap the callback passed to it in `useCallback`.
7. **What's a stale closure and how does it happen in `useEffect`?** → The effect "remembers" the value of a variable from the render it was created in; if that variable is missing from deps, later updates use the outdated value.

---

## ✅ Practice Task

Build a "Live Search" component:

- `useState` for the search text (controlled input).
- `useEffect` with cleanup to debounce an API call (e.g., `setTimeout` in the effect, clear it in cleanup) whenever the text changes.
- `useRef` to track whether it's the very first render (skip fetching on initial mount if input is empty).
- `useMemo` to filter/sort the results client-side once fetched.
- Wrap the results list item component in `React.memo` and pass a `useCallback`-wrapped `onSelect` handler to prove it doesn't re-render unnecessarily (verify with a `console.log` in the child).

# 8. Performance Optimization

React is fast by default for most apps — don't optimize prematurely. But you must know these tools and when they genuinely help (interviewers love probing whether you understand the "when NOT to" side too).

## 8.1 Why does a component re-render?

A component re-renders when:

1. Its own state changes (`useState`/`useReducer` setter called).
2. Its parent re-renders (by default, **all children re-render when the parent does**, regardless of whether their props changed).
3. A context value it consumes changes.
4. (Rare) a subscribed external store changes (`useSyncExternalStore`).

Point #2 is the one people forget — it's the reason `React.memo` exists.

## 8.2 `React.memo` — Skip Re-render If Props Didn't Change

```jsx
const ExpensiveRow = React.memo(function ExpensiveRow({ item, onSelect }) {
  console.log("rendering", item.id);
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});
```

- Does a **shallow comparison** of props. If all props are `===` to the previous render, skip re-rendering.
- Only helps if the parent re-renders often **and** this child's props usually stay the same.
- Useless (or harmful — adds a comparison cost) if props change on every render anyway (e.g. an inline object/function passed each time — see next section).

## 8.3 Why `React.memo` Often "Doesn't Work" — Referential Equality

```jsx
// ❌ `onSelect` is a NEW function every render → memo comparison always fails
<ExpensiveRow item={item} onSelect={(id) => setSelected(id)} />;

// ✅ stable reference across renders
const handleSelect = useCallback((id) => setSelected(id), []);
<ExpensiveRow item={item} onSelect={handleSelect} />;
```

Same applies to objects/arrays created inline as props — wrap with `useMemo` if they need to stay referentially stable for a memoized child.

## 8.4 `useMemo` for Expensive Computations

```jsx
const sorted = useMemo(() => expensiveSort(list), [list]);
```

Use when a calculation is genuinely heavy (large lists, complex derived data) — not for trivial math, which costs more to memoize than to just recompute.

## 8.5 Code-Splitting — `React.lazy` + `Suspense`

Ship less JS upfront; load route/feature bundles on demand.

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

Commonly paired with route-based splitting in React Router — each route's component is lazy-loaded so users only download the code for pages they actually visit.

## 8.6 List Virtualization

Rendering thousands of DOM nodes at once (a huge table/list) is slow regardless of memoization — the fix is to only render the rows currently visible in the viewport. Libraries: `react-window`, `@tanstack/react-virtual`.

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={400} itemCount={10000} itemSize={35} width="100%">
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>;
```

## 8.7 React DevTools Profiler

Before optimizing, **measure**. The Profiler tab in React DevTools records renders, shows which components re-rendered and why, and how long each took. Rule: _profile first, optimize second_ — don't guess.

## 8.8 Other quick wins

- **Stable `key`s** in lists (see file 1) — bad keys cause unnecessary unmount/remount of DOM + state loss.
- **Avoid unnecessary Context re-renders**: split a large context into smaller ones, or memoize the `value` object passed to `Provider` with `useMemo` (otherwise a new object every render re-renders every consumer).
- **Debounce/throttle** expensive handlers (scroll, resize, keystroke-triggered searches).
- **Images**: lazy-load offscreen images, use appropriately sized/compressed assets.

---

## ⚠️ Common Mistakes

1. Wrapping every component in `React.memo` "just in case" — adds comparison overhead with no benefit if props change every render anyway.
2. Using `useMemo`/`useCallback` for cheap operations — the memoization overhead can exceed the cost of just recomputing.
3. Optimizing without profiling first — fixing something that was never actually slow.
4. Forgetting that `React.memo` only does a **shallow** prop comparison — deeply nested object changes it won't detect (or will falsely detect as "changed" if you create a new object each render).

## 🎤 Interview Questions

1. **When does a child re-render even if its own props/state didn't change?** → Whenever its parent re-renders, by default — React re-renders the whole subtree unless the child is memoized.
2. **Why might wrapping a component in `React.memo` fail to prevent re-renders?** → Because one or more props (often callbacks/objects) are re-created every render, so the shallow comparison never sees them as equal — fix with `useCallback`/`useMemo` on the parent.
3. **How do you decide whether to optimize a component?** → Profile with React DevTools first; only optimize components that actually show up as slow/frequent in the profiler.
4. **What is code-splitting and how do you implement it in React?** → Breaking your JS bundle into smaller chunks loaded on demand, via `React.lazy(() => import(...))` + `<Suspense>`.
5. **When would you reach for list virtualization?** → When rendering very large lists/tables (hundreds-thousands of rows) where only a fraction is visible on screen at once.

## ✅ Practice Task

Take the "Live Search" component from [02-Core-Hooks.md](02-Core-Hooks.md)'s practice task, render 500 fake result rows, wrap the row component in `React.memo`, and use the DevTools Profiler to verify: (a) rows only re-render when their own data changes, not on every keystroke, and (b) removing the `useCallback` around the click handler breaks that.

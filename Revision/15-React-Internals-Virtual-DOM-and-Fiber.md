# 15. React Internals — Virtual DOM, Reconciliation & Fiber

This is the "how does React actually work" theory section — asked a lot in mid/senior interviews, rarely needed day-to-day, but makes every other concept (keys, batching, `memo`, Strict Mode) click into place.

## 15.1 The Virtual DOM (VDOM)

React keeps a lightweight in-memory JS object tree describing what the UI _should_ look like (the "virtual DOM"), separate from the real, slow-to-manipulate browser DOM.

Flow on every update:

1. State changes → React re-runs the component function(s) → produces a **new** virtual DOM tree.
2. React **diffs** ("reconciles") the new tree against the previous one.
3. React computes the minimal set of real DOM mutations needed and applies only those ("commit phase").

This is faster than naively re-rendering the entire real DOM on every change, because DOM operations are expensive and React batches/minimizes them.

## 15.2 Reconciliation — the Diffing Algorithm

React's diffing is **heuristic-based** (not a generic tree-diff, which would be too slow at O(n³)) — it uses two key assumptions to get to roughly O(n):

1. **Different element types → tear down and rebuild.** If a `<div>` becomes a `<span>` (or `ComponentA` becomes `ComponentB`) at the same position, React unmounts the old subtree entirely (losing its state) and mounts a fresh one — it doesn't try to patch differences between unrelated types.
2. **Same element type → update in place.** React keeps the existing DOM node and just updates changed attributes/children, preserving state.
3. **Lists use `key` to match elements across renders** — without stable keys, React falls back to comparing by index, which can incorrectly match/reuse DOM nodes (and their internal state) between semantically different list items after a reorder/insert/delete. This is _why_ the key rules in [01-JSX-Components-Props-State.md](01-JSX-Components-Props-State.md) §1.8 matter — it's a direct consequence of how reconciliation works.

## 15.3 Fiber — the Reconciliation Engine (since React 16)

"Fiber" is React's internal reimplementation of reconciliation as an **incremental, interruptible** unit-of-work tree, replacing the old purely recursive, synchronous "stack reconciler."

Why it matters:

- Old reconciler: once started, a big re-render **blocked the main thread** until fully done — could cause jank (dropped frames, unresponsive input) on large trees.
- Fiber: breaks rendering work into small units, can **pause, resume, prioritize, or abandon** work — enabling features like `useTransition`/`useDeferredValue` ([12-Advanced-Hooks.md](12-Advanced-Hooks.md)) that mark some updates as lower priority than others (e.g. keep typing responsive while a big list re-renders in the background).

Two-phase model:

- **Render phase** (can be paused/interrupted/discarded) — figure out what changed.
- **Commit phase** (always synchronous, never interrupted) — actually mutate the real DOM and run effects.

## 15.4 Batching

React groups multiple `setState` calls that happen within the same event handler (and, since React 18, **almost everywhere** — timeouts, promises, native event handlers too — "automatic batching") into a single re-render, instead of re-rendering once per call.

```js
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 18+: only ONE re-render happens after both updates, even in a setTimeout/promise
}
```

This is _why_ the functional-updater form (`setCount(c => c + 1)`) matters — within a batch, reading the outer `count` variable directly gives you the value from the render that scheduled the batch, not the just-applied update.

## 15.5 Strict Mode

`<StrictMode>` is a development-only tool that helps surface bugs by **intentionally double-invoking** certain functions (component render bodies, and — since React 18 — mount effects: mount → cleanup → mount again) to help you catch code that isn't properly resilient to being re-run/cleaned up (missing cleanup functions, side effects that shouldn't be in render, etc.). It does nothing in production builds.

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

If your app "breaks" or logs things twice only in Strict Mode/dev, that's usually a sign of a bug Strict Mode is designed to expose (e.g. a `useEffect` without proper cleanup) — not a Strict Mode problem itself.

## 15.6 Keys, Revisited With Full Context

Now that reconciliation is understood: `key` isn't "just an ID for `.map()`" — it's the literal identity React uses to match a list item across two renders and decide "reuse this DOM node + its internal state" vs "this is conceptually a new item, tear down and remount." Changing an item's `key` (even if the underlying data is the same) forces React to fully remount it — an intentional technique sometimes used to force-reset a component's internal state (e.g. `<Form key={userId} />` to fully reset the form when switching users).

---

## ⚠️ Common Mistakes

1. Believing React updates the real DOM on every state change directly — it diffs the virtual DOM first, then applies a minimal patch.
2. Assuming Strict Mode's double-invocation is a bug in your app or in React — it's intentional and dev-only.
3. Not realizing changing a `key` forces a full remount — useful deliberately, confusing when accidental.

## 🎤 Interview Questions

1. **What is the Virtual DOM and why does React use it?** → An in-memory representation of the UI; React diffs it against the previous version to compute the minimal real DOM changes needed, avoiding expensive naive full re-renders.
2. **What are React's two diffing heuristics?** → Different element types at the same position → unmount/remount; same type → update in place; list items matched via `key`.
3. **What is Fiber and why was it introduced?** → An incremental, interruptible reconciliation engine (replacing the old synchronous stack reconciler) enabling work to be paused/prioritized, which powers concurrent features like `useTransition`.
4. **What is batching and how did React 18 change it?** → Grouping multiple state updates into one re-render; React 18 made this "automatic" everywhere (promises, timeouts, native handlers), not just inside React event handlers as before.
5. **What does Strict Mode actually do?** → Development-only: double-invokes render functions and mount effects to help surface missing effect cleanup and other side-effect bugs; has zero effect in production.
6. **What happens if you change a list item's `key`?** → React treats it as an entirely different element — unmounts the old one (losing its state) and mounts a new one, even if the underlying data barely changed.

## ✅ Practice Task

Take any component with a `useEffect` that has cleanup, wrap it in `<StrictMode>`, and log-trace the mount → cleanup → mount-again sequence in dev to see this behavior firsthand. Then deliberately change a list's `key` from `item.id` to `Math.random()` and observe the (broken) remounting behavior on every render, to internalize _why_ the key rule from file 1 exists.

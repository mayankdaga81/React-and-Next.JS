# 13. Refs, Portals, Error Boundaries & Suspense

## 13.1 `forwardRef` — Pass a Ref Through a Component

By default, function components can't receive a `ref` (it's not a normal prop). `forwardRef` lets a parent get a ref to something inside a child component (usually a DOM node).

```jsx
const CustomInput = forwardRef(function CustomInput(props, ref) {
  return <input ref={ref} {...props} />;
});

function Form() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <CustomInput ref={inputRef} />;
}
```

Combine with `useImperativeHandle` ([12-Advanced-Hooks.md](12-Advanced-Hooks.md) §12.3) to expose a custom API instead of the raw node.

> Note: React 19 allows passing `ref` as a normal prop directly to function components in many cases, making `forwardRef` less necessary going forward — but you'll still see/use it in most current codebases and libraries.

## 13.2 Portals — Render Outside the Parent DOM Tree

`createPortal` renders children into a **different DOM node** than the component's normal position in the tree — while still participating in React's normal event bubbling and context.

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal-overlay">{children}</div>,
    document.getElementById("modal-root"), // a <div id="modal-root"> in index.html, outside #root
  );
}
```

**Why:** modals/tooltips/dropdowns need to escape parent `overflow: hidden` or `z-index` stacking contexts, but still logically belong to the React component tree that rendered them (click handlers, context still work normally).

## 13.3 Error Boundaries — Catch Render Errors Gracefully

A component that catches JavaScript errors thrown during rendering in its child tree, logs them, and shows a fallback UI instead of a blank white screen.

⚠️ Must currently be a **class component** — there is no hook equivalent (yet) for `componentDidCatch`/`getDerivedStateFromError`.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Caught by boundary:", error, info);
    // send to logging service (Sentry, etc.)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// usage
<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>;
```

- Catches errors in: rendering, lifecycle methods, constructors of the tree **below** it.
- Does **NOT** catch: errors in event handlers (use a normal `try/catch` there), async code, server-side rendering errors, or errors in the boundary itself.
- Common pattern: wrap each major route/section in its own boundary so one broken widget doesn't blank the entire app.
- The popular `react-error-boundary` npm package gives you this as a ready-made, hook-friendly component (`<ErrorBoundary FallbackComponent={...}>`) so you don't hand-write the class yourself.

## 13.4 `Suspense` for Data (beyond code-splitting)

Covered for code-splitting in [08-Performance-Optimization.md](08-Performance-Optimization.md) §8.5. `Suspense` can also show a fallback while a component is waiting on **async data**, if that data-fetching mechanism is Suspense-aware (React 19's `use()` hook with a Promise, or frameworks/libraries built for it).

```jsx
<Suspense fallback={<Spinner />}>
  <UserProfile userId={id} /> {/* internally calls use(fetchUserPromise) */}
</Suspense>
```

Note: RTK Query/plain `useEffect` fetching is **not** Suspense-based by default (it manages its own `isLoading` flag instead) — this is more relevant if/when you adopt React 19's `use()` pattern or a framework with built-in Suspense data-fetching (like Next.js Server Components).

---

## ⚠️ Common Mistakes

1. Forgetting a portal's target DOM node must actually exist in `index.html` before render.
2. Expecting an Error Boundary to catch errors thrown inside an `onClick` handler — it won't; wrap that logic in `try/catch` instead.
3. Only having one giant Error Boundary around the whole app — a single failing widget then blanks the entire page instead of just that section.
4. Trying to write an Error Boundary as a function component — not currently possible; must be a class (or use the `react-error-boundary` package).

## 🎤 Interview Questions

1. **What does `forwardRef` do and when do you need it?** → Lets a function component accept a `ref` and forward it to an inner DOM node/child, needed when a parent must directly access something inside a reusable component (e.g. focus an input).
2. **What is a Portal and why would you use one?** → Renders children into a different part of the actual DOM tree while keeping them in the React component tree logically (context/event bubbling still work) — used for modals/tooltips that must escape parent overflow/z-index constraints.
3. **What can and can't an Error Boundary catch?** → Catches errors during rendering/lifecycle in its child tree; does NOT catch errors in event handlers, async callbacks, or in the boundary itself.
4. **Why must Error Boundaries be class components?** → `componentDidCatch`/`getDerivedStateFromError` have no hook equivalent yet.
5. **How does `Suspense` relate to data fetching vs code-splitting?** → Same mechanism (pause rendering, show fallback until "ready"), but for data it requires a Suspense-compatible data source (e.g. React 19's `use()` with a promise) rather than just a lazy-loaded component.

## ✅ Practice Task

Build a `<Modal>` using `createPortal` targeting a `#modal-root` div, wrap your app's main content in an `ErrorBoundary` with a friendly fallback UI, and deliberately throw an error inside a deeply nested component during render to confirm the boundary catches it without crashing the whole page.

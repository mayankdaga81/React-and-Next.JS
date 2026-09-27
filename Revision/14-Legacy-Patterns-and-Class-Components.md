# 14. Legacy Patterns & Class Components

You will almost never **write** any of this in new code (2024+ codebases are ~100% function components + hooks), but interviewers — especially at companies with older codebases — still ask about it. Know it well enough to discuss confidently and read old code if you encounter it.

## 14.1 Class Components & Lifecycle Methods

Before hooks (pre-React 16.8), state and side effects only existed in class components.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log("mounted — like useEffect(fn, [])");
    this.subscription = subscribeToSomething();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log("count changed — like useEffect(fn, [count])");
    }
  }

  componentWillUnmount() {
    console.log("cleanup — like the useEffect return function");
    this.subscription.unsubscribe();
  }

  increment = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <>
        <span>{this.state.count}</span>
        <button onClick={this.increment}>+</button>
      </>
    );
  }
}
```

### Lifecycle → Hooks mapping (the key interview mapping to memorize)

| Class lifecycle                                  | Hook equivalent                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `constructor` (init state)                       | `useState(initialValue)`                                                    |
| `componentDidMount`                              | `useEffect(fn, [])`                                                         |
| `componentDidUpdate`                             | `useEffect(fn, [deps])`                                                     |
| `componentWillUnmount`                           | the function **returned** from `useEffect`                                  |
| `shouldComponentUpdate`                          | `React.memo` (for props) / manual checks                                    |
| `componentDidCatch` / `getDerivedStateFromError` | No hook equivalent — still requires a class (Error Boundaries, see file 13) |

### Why hooks replaced classes

- `this` binding footguns (`this.increment = this.increment.bind(this)` boilerplate, or arrow-function class fields).
- Related logic scattered across different lifecycle methods (setup in `componentDidMount`, cleanup in `componentWillUnmount`) instead of colocated (a single `useEffect`).
- No easy way to reuse stateful logic between components without HOCs/render props (see below) — custom hooks fixed this directly.

## 14.2 Higher-Order Components (HOCs)

A function that takes a component and returns a new, enhanced component.

```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = useAuthCheck();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

Problems: naming collisions between HOCs' injected props, unclear prop origin ("wrapper hell" — deeply nested `withA(withB(withC(Component)))`), harder to trace in DevTools. A custom hook (`useAuthCheck()` called directly inside `Dashboard`, or the `ProtectedRoute` pattern from [04-React-Router.md](04-React-Router.md)) solves the same problem far more simply today.

## 14.3 Render Props

A component that takes a **function as a prop** (often named `render` or passed as `children`) and calls it with some data/state.

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

<MouseTracker
  render={(pos) => (
    <p>
      {pos.x}, {pos.y}
    </p>
  )}
/>;
```

Same underlying goal as HOCs (share stateful logic) — same downside (nesting/readability). A custom hook `useMousePosition()` replaces this entirely, and is what you'd write today.

## 14.4 `PureComponent`

`React.PureComponent` is the class-component equivalent of `React.memo` — automatically does a shallow prop/state comparison before re-rendering. Superseded by `React.memo` for function components.

---

## ⚠️ Common Mistakes (mostly about _recognizing_, since you won't author these)

1. Assuming an old codebase's `componentDidMount`/`componentWillUnmount` pair is "the same as" a single hook — remember they may be split logically (setup vs unrelated cleanup) in ways a single `useEffect` wouldn't naturally combine, requiring you to split into multiple `useEffect`s when migrating.
2. Forgetting that `this.setState` in classes shallow-merges the previous state object automatically — `useState`'s setter does **not** do this (each `useState` slice is independent, and object state must be spread manually).

## 🎤 Interview Questions

1. **Map `componentDidMount`/`componentDidUpdate`/`componentWillUnmount` to hooks.** → All three map onto `useEffect`: mount → `useEffect(fn, [])`; update → `useEffect(fn, [deps])`; unmount → the effect's cleanup return function.
2. **What is an HOC and what problem does it solve?** → A function that wraps a component to inject additional props/behavior, used pre-hooks to share logic across components.
3. **Why did hooks largely replace HOCs and render props?** → Avoids wrapper/nesting hell and naming collisions, and keeps related logic colocated in one function instead of spread across a wrapping hierarchy.
4. **Does `this.setState` behave differently from the `useState` setter?** → Yes — class `setState` shallow-merges into the existing state object automatically; the `useState` setter fully replaces the value for that particular state slice (you must spread manually to "merge" an object).
5. **What's `PureComponent`?** → Class equivalent of `React.memo` — shallow-compares props/state to skip unnecessary re-renders.

## ✅ Practice Task

Take the `useReducer` counter from [12-Advanced-Hooks.md](12-Advanced-Hooks.md) and rewrite it as an old-school class component with `this.state`/`this.setState` and bound methods, purely as an exercise in reading/writing legacy syntax — then note out loud (or in comments) every hook-based simplification you'd apply if converting it back.

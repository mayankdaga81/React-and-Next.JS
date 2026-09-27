# 7. Component Patterns & Custom Hooks

## 7.1 Composition Over Configuration

Instead of one giant component with tons of boolean props controlling every variation, **compose** smaller pieces using `children`.

```jsx
// ❌ Configuration-heavy
<Modal showHeader showFooter showCloseButton title="Confirm" footerText="OK" />

// ✅ Composition
<Modal>
  <Modal.Header>Confirm</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer><Button>OK</Button></Modal.Footer>
</Modal>
```

This is why the `children` prop matters so much — it's the primary composition mechanism in React (instead of inheritance, which React explicitly discourages between components).

## 7.2 Custom Hooks — Extracting Reusable Logic

A custom hook is just a JS function whose name starts with `use` and which may call other hooks internally. It lets you **share stateful logic** between components (something plain functions can't do, since plain functions can't hold their own state across renders).

```js
// hooks/useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// usage — looks just like useState!
const [cart, setCart] = useLocalStorage("cart", []);
```

Real example from this repo: `05. Custom Hooks/src/hooks/useCard.js` — a `useCart` hook managing cart state + localStorage sync + cross-tab sync via the `storage` event. Go re-read that file — it's a great real example of custom hooks earning their keep.

### Other common custom hook examples (know these patterns)

- `useDebounce(value, delay)` — returns a debounced version of a fast-changing value (e.g. search input).
- `useToggle(initial)` — `[value, toggle]` boolean flip helper.
- `useFetch(url)` — shown in [06-Data-Fetching-and-Async.md](06-Data-Fetching-and-Async.md).
- `usePrevious(value)` — track a value's previous render using `useRef` + `useEffect`.
- `useOnClickOutside(ref, handler)` — close a dropdown/modal when clicking outside it.

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current; // still holds the value from BEFORE this render's update
}
```

### Custom hook rules

- Must start with `use` (so React's linter can enforce Rules of Hooks on it, and so other devs know it may hold state).
- Follows the same Rules of Hooks internally as components.
- Returns whatever is useful: a value, `[value, setter]` tuple (like `useState`), or an object of values/functions.

## 7.3 Higher-Order Components & Render Props (mention only — full detail in Tier 2)

Before hooks existed (pre-2019), logic reuse was done via **HOCs** (`withAuth(Component)`) or **render props** (`<DataProvider render={(data) => ...} />`). Custom hooks have almost entirely replaced both patterns in new code. Full explanation with examples in [14-Legacy-Patterns-and-Class-Components.md](14-Legacy-Patterns-and-Class-Components.md) — know it exists, know why hooks superseded it, don't reach for it in new code.

## 7.4 Folder Structure Conventions (feature-based, common in RTK codebases)

```
src/
  app/
    store.js
  features/
    todos/
      todosSlice.js
      TodoList.jsx
      TodoItem.jsx
      todosApi.js        // RTK Query endpoints for this feature
  components/            // shared, dumb/presentational components (Button, Modal, Card)
  hooks/                  // shared custom hooks
```

"Feature folder" (a.k.a. "ducks" pattern) groups everything related to one feature together (slice + components + api), instead of splitting by type (`all-reducers/`, `all-components/`) — scales much better on real teams.

## 7.5 Presentational vs Container Components (older but still-referenced terminology)

- **Presentational ("dumb")**: only cares about how things look, receives everything via props, no state/logic beyond UI state.
- **Container ("smart")**: fetches data, manages state, passes data down to presentational children.
  With hooks, this line is blurrier (a component can be both), but the _separation of concerns_ idea still matters — keep data-fetching/business logic separate from pure rendering where practical.

---

## ⚠️ Common Mistakes

1. Duplicating the same `useEffect`/`useState` logic across multiple components instead of extracting a custom hook.
2. Custom hook not starting with `use` → ESLint can't enforce Rules of Hooks on it, bugs slip through.
3. Overusing boolean "config" props instead of composing with `children`.
4. Putting everything in one 500-line component instead of splitting by responsibility.

## 🎤 Interview Questions

1. **What is a custom hook and why use one?** → A function starting with `use` that encapsulates reusable stateful logic across components — DRY for stateful behavior, which plain utility functions can't achieve.
2. **How is a custom hook different from a regular utility function?** → It can call other hooks (`useState`, `useEffect`, etc.) and therefore hold/react to component state across renders; a plain function can't.
3. **What problem does the `children` prop solve?** → Enables composition — a parent component can render arbitrary nested content without knowing its shape in advance.
4. **HOCs/render props vs custom hooks — why did hooks win?** → Hooks avoid "wrapper hell" (deeply nested HOCs) and prop-name collisions, and are far more composable/readable.
5. **What's the difference between presentational and container components?** → Presentational = UI only, driven by props; Container = manages state/data-fetching and delegates rendering.

## ✅ Practice Task

Write `useDebounce(value, delay)` and `useOnClickOutside(ref, handler)` from scratch (no copying), then use them together to build a search dropdown that: debounces the query, fetches suggestions, and closes when clicking outside the component.

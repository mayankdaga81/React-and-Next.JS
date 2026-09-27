# 1. JSX, Components, Props & State — The Absolute Foundations

> Cross-reference in this repo: `01. Start/`, `02. Counter State/`, `03. Queue Management/`. This file assumes zero prior memory — read start to finish.

---

## 1.1 What is React, actually?

React is a **JavaScript library for building user interfaces** out of small, reusable pieces called **components**. You describe _what_ the UI should look like for a given state, and React figures out _how_ to update the real DOM efficiently (see [15-React-Internals](15-React-Internals-Virtual-DOM-and-Fiber.md) for the "how").

Core idea: **UI = f(state)**. Your component is a function; give it state/props, it returns UI.

---

## 1.2 JSX

JSX is a syntax extension that looks like HTML but is actually JavaScript. It compiles to `React.createElement(...)` calls (or the newer automatic JSX runtime in React 17+).

```jsx
const el = <h1 className="title">Hello {name}</h1>;
// compiles roughly to:
const el = jsx("h1", { className: "title", children: ["Hello ", name] });
```

### JSX rules you must know

- **One root element** per return — or use a **Fragment** `<>...</>` to avoid an extra wrapper `<div>`.
- Use `className` not `class`, `htmlFor` not `for` (JS reserved words).
- Any JavaScript expression goes inside `{ }`. Statements (if/for) do **not** work inside `{ }` — only expressions.
- JSX must return a single value — this is why `{condition && <X/>}` and ternaries are used instead of `if` blocks directly in the markup.
- Comments inside JSX: `{/* like this */}`.

```jsx
function Greeting({ name }) {
  return (
    <>
      <h1>Hello, {name}</h1>
      {/* Fragment avoids an unnecessary wrapping <div> */}
    </>
  );
}
```

---

## 1.3 Components

A component is a JavaScript function that returns JSX.

- **Must start with an uppercase letter** — lowercase tags (`<div>`) are treated as native DOM elements; uppercase (`<Card>`) as your components.
- Should ideally do **one thing** (single responsibility) — keeps them testable and reusable.

```jsx
function Card({ title, description }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
export default Card;
```

---

## 1.4 Props (read-only inputs)

Props flow **one-way**: parent → child. A child can never modify its own props directly.

```jsx
<Card title="Welcome" description="First card" />
```

```jsx
function Card(props) {
  return <h1>{props.title}</h1>;
}
// Preferred: destructure
function Card({ title, description }) {
  return <h1>{title}</h1>;
}
```

### Default props (modern way — default parameter values)

```jsx
function Button({ label = "Click me", variant = "primary" }) { ... }
```

### The special `children` prop

Anything between opening/closing tags becomes `props.children`.

```jsx
<Card>
  <p>Any JSX can go here</p>
</Card>;

function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

This is the foundation of **composition** — see [07-Component-Patterns](07-Component-Patterns-and-Custom-Hooks.md).

### Spreading props

```jsx
<Component {...userObj} />
```

Use sparingly — it's convenient but makes it harder to see at a glance what props a component receives.

---

## 1.5 State — `useState`

Props are given by the parent; **state is data a component owns and can change itself**.

```js
const [count, setCount] = useState(0);
```

- `count` — current value (only valid for the render it belongs to).
- `setCount` — the only correct way to change it. **Never mutate state directly.**
- Calling the setter triggers a **re-render**.

### Functional updates — avoid stale state

```js
// ❌ Risky when called multiple times in the same tick / batched updates
setCount(count + 1);
setCount(count + 1); // still uses the OLD `count`, only +1 total

// ✅ Correct — always uses the latest value
setCount((prev) => prev + 1);
setCount((prev) => prev + 1); // +2 total
```

**Rule of thumb:** if the new state depends on the previous state, always use the functional updater form.

### State is asynchronous (conceptually)

```js
setCount(5);
console.log(count); // still logs the OLD value — the update hasn't re-rendered yet
```

### Lazy initial state

If computing the initial value is expensive, pass a function instead of a value so it only runs once:

```js
const [cart, setCart] = useState(
  () => JSON.parse(localStorage.getItem("cart")) ?? [],
);
```

### Derived values are NOT state

If a value can be _computed_ from existing state/props, don't put it in `useState` — just compute it during render (or memoize it if expensive, see `useMemo`).

```js
// ❌ unnecessary state
const [doubled, setDoubled] = useState(count * 2);
// ✅ just compute it
const doubled = count * 2;
```

---

## 1.6 Controlled Components (forms 101)

An input is "controlled" when its value is driven by React state, making React the single source of truth.

```jsx
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />;
```

See [03-Event-Handling-and-Forms](03-Event-Handling-and-Forms.md) for the full forms deep-dive (including `react-hook-form`, which is what's actually used for anything beyond a trivial form).

---

## 1.7 Conditional Rendering

```jsx
{
  isLoggedIn ? <Dashboard /> : <LoginPage />;
} // ternary — if/else
{
  items.length === 0 && <EmptyState />;
} // && — render only if true
{
  error ? <ErrorMsg /> : null;
} // explicit null renders nothing
```

⚠️ Gotcha: `{count && <Badge/>}` — if `count` is `0`, React renders the literal `0` on screen (since `0` is falsy but not `null`/`undefined`). Fix: `{count > 0 && <Badge/>}` or `{Boolean(count) && ...}`.

---

## 1.8 Rendering Lists & the `key` prop

```jsx
{
  queue.map((customer) => <QueueItem key={customer.id} data={customer} />);
}
```

- `key` must be **stable, unique among siblings** (an ID from your data — not random or re-generated each render).
- **Never use array `index` as key** if the list can be reordered, filtered, or items inserted/removed in the middle — React will mis-match state between renders (e.g., a text input's value ending up on the wrong row). Index-as-key is only "safe" for a fully static list that never reorders/changes length.
- `key` is not accessible via `props.key` inside the component — it's consumed by React internally for reconciliation (see file 15).

---

## 1.9 Immutable state updates (very commonly tested in interviews)

Never mutate arrays/objects in state — always create a new reference so React detects the change.

```js
// Adding
setQueue([...queue, newItem]);
// Updating one item
setQueue(
  queue.map((item) => (item.id === id ? { ...item, status: "done" } : item)),
);
// Removing
setQueue(queue.filter((item) => item.id !== id));
```

Why? React compares state by **reference** (`Object.is`) to decide whether to re-render — mutating in place means the reference doesn't change, so React might not re-render at all.

---

## ⚠️ Common Mistakes

1. Mutating state directly (`state.push(x)` then calling `setState(state)`).
2. Using stale `count` instead of functional updater in rapid/batched updates.
3. Forgetting `key` in lists, or using array index as key on dynamic lists.
4. Putting derived data into `useState` instead of computing it inline.
5. Returning multiple sibling elements without a Fragment or wrapper.

---

## 🎤 Interview Questions

1. **What is JSX and how does it work under the hood?** → Syntax sugar that compiles to `React.createElement`/`jsx()` calls producing plain JS objects (React elements).
2. **Why must component names be capitalized?** → So JSX can distinguish your components from native HTML tags.
3. **What's the difference between props and state?** → Props: read-only, passed from parent. State: owned by the component, mutable via setter, triggers re-render.
4. **Why shouldn't you use array index as a key?** → Causes UI/state mismatches when list order/length changes, because React uses `key` to match old vs new elements during reconciliation.
5. **Why use the functional update form of `setState`?** → To avoid stale closures when new state depends on previous state, especially under batching.
6. **What happens if you mutate state directly?** → React may not detect the change (reference is same) and skip re-render, or cause inconsistent UI.
7. **What is the `children` prop?** → A special prop containing whatever JSX is nested between a component's opening/closing tags — enables composition.

---

## ✅ Practice Task

Build a small "Todo List" component from scratch (new file, don't peek at existing folders first):

- `useState` array of todos `{ id, text, done }`.
- Add todo via controlled input + button.
- Toggle `done` via click (immutable update).
- Delete a todo (immutable filter).
- Render list with proper `key`, conditional "No todos yet" empty state.

Then compare your approach against `03. Queue Management/src/` in this repo.

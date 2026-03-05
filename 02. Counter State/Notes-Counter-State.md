# Revision Notes – Counter State & Hooks

These notes correspond to the example in `02. Counter State/src/App.jsx`. Open that file side-by-side with this document when you review.

---

## 📁 Project structure

```
02. Counter State/
  ├─ src/
  │   └─ App.jsx          ← everything is in this single component for the demo
  └─ index.css           ← global styles (see below)
```

| File        | Purpose                                                                |
| ----------- | ---------------------------------------------------------------------- |
| `index.css` | global CSS rules that apply to the whole app (imported in `main.jsx`). |
| `App.css`   | styles specific to `App` component (scoped via import in `App.jsx`).   |

> 💡 **Global CSS vs component CSS**
>
> - Put site-wide rules, resets, fonts, colors etc. in `index.css`.
> - When a component needs its own styles, create/modify a CSS file and import it at the top of that component file (`import "./App.css"`).

---

## 🪝 React Hooks & State

### Hook definition

A _hook_ is a special function provided by React. Hooks let you "hook into" React features such as state, lifecycle, or context from a functional component.

`useState` is a built-in hook used for local state. It always starts with the word `use`.

```js
const [count, setCount] = useState(0);
```

- `count` is the current state value (initially `0`).
- `setCount` is the updater function we call to modify `count`.
- Hooks must be called at the **top level of the component** and not inside loops/conditions.

---

## 🧠 What is state?

State is a special object managed by React that determines what the UI renders. Unlike plain JavaScript variables, updating state tells React to re-render the component automatically.

> **State vs normal variables**
>
> - Normal variables are reset every render and don't trigger updates.
> - State is preserved between renders and changing it causes React to schedule an update.

---

## 🔄 Updating state

Never mutate the state variable directly; always use the `set…` function returned by `useState`.

```js
setCount(5);
setCount(count + 1);
```

By convention the setter is named `setX` where `X` is the state name.

---

## ⚠️ React batching behavior

React may **batch multiple state updates** during the same render cycle.

Example:

```js
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

Even though we called it three times, the counter increases only **by 1**.

Why?

Because `count` still holds the **same value from the current render**. So, each time we are updating the count to the same value.

---

## ✅ Correct way: Functional updater

Use the **functional form** to always compute from the latest state value.
- Functional form - Here you pass a function to the setter. In the exmaple below, we have passed an arrow function inside the setter, whereas in the previous example, we passed the value dircetly.

```js
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

Now the counter correctly increases by **3**.

The functional updater receives the **latest state value**, avoiding stale closures.

---

# ⚠️ Important Scenario – Stale State in Arrow Functions

Sometimes developers write code like this:

```js
setCount(count + 1);
```

This works in simple cases.

However, when React batches updates or when multiple updates happen in the same render, this may use the **old value of `count`**.

Example:

```js
setCount(count + 1);
setCount(count + 1);
```

Both updates use the **same original value**, so the counter increases only once.

---

## ✅ Recommended pattern

Instead of using the state variable directly, use the **previous state argument**:

```js
setCount((prev) => prev + 1);
```

Here:

- `prev` → latest state value
- `prev + 1` → updated state

This ensures the update **always uses the correct current state**.

---

# 📌 When should you use functional updates?

Use this pattern whenever:

- State depends on the **previous state**
- Multiple updates may happen in a single render
- Updates occur inside loops, intervals, or async callbacks

Example:

```js
setCount((prev) => prev + 1);
```

---

# ✅ App.jsx walkthrough

### 1️⃣ State declarations

```js
const [count, setCount] = useState(0);
const [countToSet, setCountToSet] = useState(0);
```

- `count` holds the counter.
- `countToSet` stores the value from the text input.

---

### 2️⃣ Handler functions

```js
function handleDecrease() {
  setCount(Math.max(count - 1, 0));
}

function handleReset() {
  setCount(0);
}
```

These illustrate separate functions versus inline updates.

---

### 3️⃣ Buttons

- `Increase` uses an inline arrow function:

```js
onClick={() => setCount(count + 1)}
```

- `Decrease` calls a handler:

```js
onClick={() => handleDecrease()}
```

- `Reset` passes the handler directly:

```js
onClick={handleReset}
```

> When arguments or logic are required, wrap the call in an arrow function.  
> Otherwise pass the function reference directly.

---

### 4️⃣ Form input

```jsx
<input
  type="text"
  value={countToSet}
  onChange={(e) => setCountToSet(Number(e.target.value))}
/>
```

- `onChange` receives an event.
- The input value is inside `e.target.value`.
- Convert the string to a number before storing it.

---

### 5️⃣ Set button

```jsx
<button
  onClick={() => {
    setCount(Number(countToSet));
    setCountToSet(0);
  }}
>
  Set to {countToSet}
</button>
```

Demonstrates updating **multiple pieces of state** in one handler.

---

# 🔁 Additional React State Scenarios

## 1️⃣ Updating multiple states

React allows updating multiple states in one event.

```js
setCount(10);
setCountToSet(0);
```

React batches these updates for performance.

---

## 2️⃣ State updates are asynchronous

State updates do **not happen immediately**.

Example:

```js
setCount(5);
console.log(count);
```

The console may still show the **old value** because React schedules the update.

---

## 3️⃣ Derived state

Sometimes one state is derived from another.

Example:

```js
const doubled = count * 2;
```

In such cases, **do not create separate state** unless necessary.

---

## 4️⃣ Controlled components

Inputs that use React state are called **controlled components**.

Example:

```jsx
<input value={countToSet} onChange={...} />
```

React becomes the **single source of truth** for the input value.

---

## 🔁 Additional notes

- The counter resets to `0` if you try to decrement below zero (see `Math.max`).
- Buttons and inputs are styled inline in this example, but you can move those rules to `App.css` when refactoring.
- Examples in `App.jsx` can be copied into other components; the same state logic applies.

---

## 🧠 Mental Model

- `useState` stores data between renders.
- Calling `setState` triggers a re-render.
- React may batch updates for performance.
- Use **functional updates** when the new state depends on the previous state.
- Avoid directly mutating state.

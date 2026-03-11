# Zustand State Management – Quick Revision Notes

## 1. What is Zustand?

Zustand is a **lightweight state management library for React** used to create **global state without Context API, reducers, or providers**.  
It allows any component in the app to access and update shared state easily.

Think of Zustand as **a global version of `useState`**.

---

# 2. Creating a Store

Example:

```javascript
import { create } from "zustand";

export const useCounterStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

This creates a **global store**.

Structure of the store:

```
useCounterStore
   │
   ├── count
   ├── increase()
   ├── decrease()
   └── reset()
```

---

# 3. `create()` Function

```javascript
create((set) => ({ ... }))
```

`create()` is used to **create the global state store**.

Inside it we define:

- State variables
- Functions to update state

---

# 4. `set` Function

`set` is used to **update the state**.

Example:

```javascript
set({ count: 0 });
```

or

```javascript
set((state) => ({ count: state.count + 1 }));
```

The second form is preferred when the new state depends on the **previous state**.

---

# 5. Initial State

```javascript
count: 0;
```

This sets the starting value of the store.

Initial store:

```
count = 0
```

---

# 6. Updating State

### Increase

```javascript
increase: () => set((state) => ({ count: state.count + 1 }));
```

Example:

```
count = 2 → 3
```

---

### Decrease

```javascript
decrease: () => set((state) => ({ count: state.count - 1 }));
```

Example:

```
count = 3 → 2
```

---

### Reset

```javascript
reset: () => set({ count: 0 });
```

Directly sets the state.

---

# 7. Using Zustand in a Component

```javascript
import { useCounterStore } from "./store";

function Counter() {
  const { count, increase, decrease, reset } = useCounterStore();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

Calling:

```javascript
useCounterStore();
```

gives access to the **global state and functions**.

No provider is required.

---

# 8. Why Zustand is Popular

| Context API                | Zustand               |
| -------------------------- | --------------------- |
| Requires Provider          | ❌ No Provider needed |
| More boilerplate           | Very minimal code     |
| Re-renders many components | Optimized updates     |
| Complex for large apps     | Simple and scalable   |

---

# 9. Preventing Unnecessary Re-renders

Instead of grabbing the entire store:

```javascript
const { count } = useCounterStore();
```

You can select only the needed value:

```javascript
const count = useCounterStore((state) => state.count);
```

Now the component **only re-renders when `count` changes**.

---

# 10. Mental Model

Zustand behaves like a **global `useState`**.

Example with `useState`:

```javascript
const [count, setCount] = useState(0);
```

Zustand version:

```javascript
count: 0
increase: () => set(...)
```

But this state is **accessible from any component in the app**.

---

# One-Line Revision

Zustand creates a **global state store using `create()`**, where state and update functions are defined, and any React component can access or update that state without needing providers.

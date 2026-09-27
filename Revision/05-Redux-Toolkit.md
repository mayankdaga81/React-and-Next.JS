# 5. Redux Toolkit (RTK) — Your Real-World State Manager

> This repo's existing notes cover **Zustand** ([06. Zustand/Notes-Zustand.md](../06.%20Zustand/Notes-Zustand.md)) and **Context API** ([04. Prop Guide/Notes-Props-Context.md](../04.%20Prop%20Guide/Notes-Props-Context.md)) — good to know as alternatives, but **Redux Toolkit is what you use at work**, so it gets the full Tier-1 treatment here.

## 5.1 Why Redux Toolkit (not "plain" Redux)?

Plain Redux required tons of boilerplate (action types, action creators, manual immutable updates, `combineReducers`, store setup with middleware). **Redux Toolkit (RTK)** is the official, opinionated way to write Redux today — less code, sane defaults, built-in Immer (write "mutating" code that's actually immutable under the hood), built-in Thunk middleware, DevTools enabled by default.

## 5.2 Core Building Blocks

### `createSlice` — state + reducers + actions in one place

```js
// features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1; // looks like mutation, Immer makes it immutable under the hood
    },
    decrement(state) {
      state.value -= 1;
    },
    incrementByAmount(state, action) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### `configureStore` — sets up the store with good defaults

```js
// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // ...other slices
  },
});
```

### Wire the store to React

```jsx
import { Provider } from "react-redux";
import { store } from "./app/store";

<Provider store={store}>
  <App />
</Provider>;
```

### `useSelector` / `useDispatch` — read & write from components

```jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../features/counter/counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </>
  );
}
```

⚠️ **Selector performance tip:** select the smallest piece of state you need (`state.counter.value`, not `state.counter`) so the component only re-renders when that exact value changes, not on every unrelated change in the slice.

## 5.3 Async Logic — `createAsyncThunk`

For side effects (API calls) that need to dispatch multiple actions (pending/fulfilled/rejected):

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
```

Dispatch it like a normal action: `dispatch(fetchUser(id))`.

## 5.4 RTK Query — the modern replacement for hand-written thunks

For most data-fetching, **RTK Query** (built into Redux Toolkit) removes the need to write thunks/reducers/loading-state boilerplate entirely. Full details in [06-Data-Fetching-and-Async.md](06-Data-Fetching-and-Async.md).

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getUser: builder.query({ query: (id) => `users/${id}` }),
  }),
});

export const { useGetUserQuery } = api;

// in a component:
const { data, isLoading, error } = useGetUserQuery(userId);
```

## 5.5 Redux DevTools & Middleware

- `configureStore` wires up Redux DevTools automatically in development — inspect every dispatched action + state diff, huge for debugging.
- Custom middleware (logging, analytics) can be added via `configureStore({ middleware: (getDefault) => getDefault().concat(myMiddleware) })`.

## 5.6 Redux vs Zustand vs Context — the interview comparison

|                   | Redux Toolkit                           | Zustand                               | Context API                                                         |
| ----------------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| Boilerplate       | Low (thanks to RTK)                     | Very low                              | Low, but scales poorly                                              |
| DevTools          | Excellent, built-in                     | Good (via middleware)                 | None                                                                |
| Async built-in    | Yes (thunks, RTK Query)                 | No (manual)                           | No                                                                  |
| Re-render control | Fine-grained via selectors              | Fine-grained via selectors            | Coarse — any change re-renders all consumers unless split carefully |
| Best for          | Medium-large apps, teams, complex async | Small-medium apps, quick global state | Simple app-wide values (theme, auth flag) rarely changing           |
| Used at your job  | ✅ Primary                              | Nice-to-know alternative              | Know the theory                                                     |

---

## ⚠️ Common Mistakes

1. Mutating state **outside** a slice reducer (Immer only makes reducers safe to "mutate" — never mutate state directly elsewhere).
2. Selecting the entire slice/state in `useSelector` instead of the specific field → unnecessary re-renders.
3. Forgetting to register a new slice's reducer in `configureStore`.
4. Writing thunks by hand for simple GET requests when RTK Query would remove all that boilerplate.
5. Putting non-serializable values (functions, class instances, Promises) into Redux state — breaks DevTools and RTK's serializability checks.

## 🎤 Interview Questions

1. **Why Redux Toolkit over plain Redux?** → Less boilerplate, built-in Immer for immutable-looking updates, built-in Thunk, sane `configureStore` defaults, DevTools out of the box.
2. **How does `createSlice` let you write "mutating" code safely?** → It uses **Immer** internally, which tracks changes to a draft state and produces a new immutable state object.
3. **What's the difference between `useSelector` and `useDispatch`?** → `useSelector` reads a piece of state (subscribes to updates for that value); `useDispatch` returns the `dispatch` function to send actions.
4. **How do you handle async API calls in Redux Toolkit?** → `createAsyncThunk` (manual, gives pending/fulfilled/rejected) or RTK Query (declarative, handles caching/loading/error automatically).
5. **Why is selecting the smallest slice of state in `useSelector` important?** → To avoid re-rendering the component on unrelated state changes — `useSelector` re-runs on every dispatch and re-renders if the selected value changed by reference/equality.
6. **Redux vs Context API — when would you pick each?** → Context for rarely-changing simple global values (theme/locale); Redux Toolkit for complex, frequently-updating, multi-feature app state with async needs and devtools/debugging requirements.

## ✅ Practice Task

Build a small Redux Toolkit "Todo" feature:

- `todosSlice` with `addTodo`, `toggleTodo`, `removeTodo` reducers (mutate `state` directly inside reducers, trust Immer).
- `configureStore` wiring it up, `<Provider>` around the app.
- A component using `useSelector` (select the todos array) + `useDispatch` for actions.
- Add a `createAsyncThunk` `fetchTodos` that loads initial todos from a fake API (`jsonplaceholder.typicode.com/todos`), handle `pending/fulfilled/rejected` in `extraReducers`, and show a loading spinner / error message accordingly.

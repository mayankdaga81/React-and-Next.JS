# 99. Interview Question Bank — Rapid Fire

Use this the night before / morning of an interview. Every question links back to the full explanation if your answer feels shaky — go re-read that section, don't just memorize the one-liner here.

---

## Foundations — [01](01-JSX-Components-Props-State.md)

- **Q: What is JSX?** A syntax extension compiling to `React.createElement`/`jsx()` calls; produces plain JS objects describing UI.
- **Q: Props vs state?** Props = read-only, from parent. State = owned, mutable via setter, triggers re-render.
- **Q: Why capitalize component names?** So JSX can tell your components apart from native HTML tags.
- **Q: Why avoid array index as `key`?** Breaks identity matching during reconciliation when list order/length changes — can mismatch state between rows.
- **Q: Why use the functional updater `setX(prev => ...)`?** Avoids stale closures when new state depends on old state, especially with batched/rapid updates.
- **Q: Why not mutate state directly?** React detects changes by reference; mutating in place may not trigger a re-render, and breaks the immutability assumptions React optimizations rely on.

## Core Hooks — [02](02-Core-Hooks.md)

- **Q: Rules of Hooks?** Call only at top level (no loops/conditions), only from components/custom hooks, same order every render.
- **Q: `useMemo` vs `useCallback`?** `useMemo` memoizes a value; `useCallback` memoizes a function reference (sugar over `useMemo`).
- **Q: `useEffect` timing?** Runs after paint, asynchronously, non-blocking.
- **Q: When to use `useRef` over `useState`?** When a value's change shouldn't trigger a re-render (timers, DOM refs, mutable flags, previous-value tracking).
- **Q: What causes an effect to re-run every render unintentionally?** An inline object/array/function in the dependency array — new reference every time.

## Forms — [03](03-Event-Handling-and-Forms.md)

- **Q: Controlled vs uncontrolled inputs?** Controlled: React state is source of truth, re-renders each keystroke, easy validation. Uncontrolled: DOM holds value, read via ref, fewer re-renders.
- **Q: Why `react-hook-form` over manual `useState` per field?** Fewer re-renders (uncontrolled internally), built-in validation via resolvers (Zod/Yup), less boilerplate.
- **Q: What is a SyntheticEvent?** React's normalized cross-browser wrapper around native DOM events.

## Routing — [04](04-React-Router.md)

- **Q: How does client-side routing avoid full reloads?** Intercepts navigation via the History API (`pushState`), re-renders only the matched route component.
- **Q: `useParams` vs `useSearchParams`?** Params = dynamic path segments; search params = query string.
- **Q: How do you implement a protected route?** A wrapper checking auth state, rendering children/`<Outlet/>` or `<Navigate to="/login"/>`.
- **Q: What does `<Outlet/>` do?** Renders the matched nested/child route within a parent layout route.

## Redux Toolkit — [05](05-Redux-Toolkit.md)

- **Q: Why Redux Toolkit over plain Redux?** Less boilerplate, built-in Immer, built-in Thunk, sane `configureStore` defaults, DevTools by default.
- **Q: How does `createSlice` allow "mutating" code safely?** Uses Immer internally — tracks draft mutations, produces a real immutable new state.
- **Q: `useSelector` vs `useDispatch`?** `useSelector` reads/subscribes to a piece of state; `useDispatch` returns the function to send actions.
- **Q: How do you handle async logic?** `createAsyncThunk` (manual pending/fulfilled/rejected) or RTK Query (declarative, handles caching/loading automatically).
- **Q: Why select the smallest slice of state in `useSelector`?** Avoids re-rendering on unrelated state changes elsewhere in the store.
- **Q: Context vs Redux — when to pick each?** Context: rarely-changing simple global values. Redux Toolkit: complex, frequently-updating state, async-heavy, needs devtools/fine-grained subscriptions.

## Data Fetching — [06](06-Data-Fetching-and-Async.md)

- **Q: How do you handle a race condition in fetching?** Ignore stale responses via a cancellation flag, or cancel with `AbortController`; RTK Query handles this automatically.
- **Q: `fetch` vs `axios`?** `axios`: auto JSON parsing, interceptors, nicer errors. `fetch`: native, more manual.
- **Q: What does RTK Query solve?** Removes hand-written loading/error/caching/race-condition boilerplate; caching + invalidation via tags.
- **Q: `providesTags` vs `invalidatesTags`?** Query "provides" a tag; mutation "invalidates" it, forcing tagged queries to refetch.
- **Q: `isLoading` vs `isFetching` in RTK Query?** `isLoading`: true only on first fetch (no cache yet). `isFetching`: true on any in-flight request including background refetches.

## Component Patterns / Custom Hooks — [07](07-Component-Patterns-and-Custom-Hooks.md)

- **Q: What is a custom hook?** A function starting with `use` encapsulating reusable stateful logic across components.
- **Q: How is it different from a plain utility function?** It can call other hooks and hold state/effects across renders; plain functions can't.
- **Q: Why did hooks replace HOCs/render props?** Avoids wrapper-hell nesting and prop-name collisions; more composable and readable.

## Performance — [08](08-Performance-Optimization.md)

- **Q: Why does a child re-render even with unchanged props?** Because its parent re-rendered — React re-renders the whole subtree by default unless the child is memoized.
- **Q: Why might `React.memo` fail to prevent re-renders?** A prop (often a callback/object) is re-created every render — wrap it in `useCallback`/`useMemo` on the parent.
- **Q: How do you decide what to optimize?** Profile first with React DevTools Profiler; only optimize what's actually shown to be slow/frequent.
- **Q: What is code-splitting?** Breaking the JS bundle into chunks loaded on demand via `React.lazy` + `Suspense`.

## TypeScript — [09](09-TypeScript-with-React.md)

- **Q: Why annotate `useState<User | null>(null)` explicitly?** TS would otherwise infer the type purely from `null`, blocking future real assignments.
- **Q: How do you type Redux Toolkit correctly?** Export `RootState`/`AppDispatch` from the store, build typed `useAppSelector`/`useAppDispatch` wrappers used everywhere.
- **Q: What type for `children`?** `React.ReactNode`.

## Testing — [10](10-Testing-React-Apps.md)

- **Q: RTL's guiding philosophy?** Test the way a user interacts with the UI, not internal implementation.
- **Q: `getBy` vs `queryBy` vs `findBy`?** `getBy`: throws if absent (existence). `queryBy`: returns `null` if absent (absence checks). `findBy`: async, waits for element (post-effect UI).
- **Q: How do you test a Redux-connected component?** Render wrapped in a real `<Provider>` with a fresh/test store, not a mocked Redux.
- **Q: Why prefer `getByRole` over `getByTestId`?** Mirrors real user/assistive-tech perception + free accessibility check; `data-testid` has no relation to real UX.

## Context API — [11](11-Context-API.md)

- **Q: Main Context performance pitfall?** Every consumer re-renders whenever the Provider's value changes — no fine-grained per-field subscription.
- **Q: How do you avoid unnecessary Context re-renders?** Memoize the `value` with `useMemo`; split large contexts into smaller focused ones.

## Advanced Hooks — [12](12-Advanced-Hooks.md)

- **Q: When to use `useReducer` over `useState`?** Multiple related sub-values or complex transitions, especially updated the same way from many places (centralizes logic, improves testability).
- **Q: `useEffect` vs `useLayoutEffect`?** `useEffect`: async, after paint. `useLayoutEffect`: sync, before paint — only for DOM measurement/adjustment to avoid flicker.
- **Q: What does `useTransition` solve?** Marks an update as low priority so urgent updates (e.g. typing) stay responsive while an expensive re-render happens in the background.

## Refs / Portals / Error Boundaries — [13](13-Refs-Portals-ErrorBoundaries-Suspense.md)

- **Q: What can't an Error Boundary catch?** Errors in event handlers, async callbacks, or within the boundary itself — only render/lifecycle errors in its child tree.
- **Q: Why must Error Boundaries be classes?** No hook equivalent yet for `componentDidCatch`/`getDerivedStateFromError`.
- **Q: Why use a Portal?** To render outside a parent's DOM position (escaping `overflow`/`z-index` constraints) while keeping React context/event bubbling intact.

## Legacy Patterns — [14](14-Legacy-Patterns-and-Class-Components.md)

- **Q: Map lifecycle methods to hooks.** `componentDidMount` → `useEffect(fn, [])`; `componentDidUpdate` → `useEffect(fn, [deps])`; `componentWillUnmount` → effect cleanup return.
- **Q: Does class `setState` differ from the `useState` setter?** Yes — class `setState` shallow-merges automatically; `useState`'s setter fully replaces that state slice (must spread manually to merge an object).

## React Internals — [15](15-React-Internals-Virtual-DOM-and-Fiber.md)

- **Q: What is the Virtual DOM for?** Diff a lightweight JS representation against the previous version to compute the minimal real DOM patch, avoiding expensive naive re-renders.
- **Q: What is Fiber?** An incremental, interruptible reconciliation engine (replacing the old synchronous stack reconciler), enabling prioritized/concurrent rendering features.
- **Q: What is batching?** Grouping multiple state updates into a single re-render; React 18 made this automatic almost everywhere.
- **Q: What does Strict Mode actually do?** Dev-only double-invocation of render/mount-effects to surface missing cleanup / side-effect bugs; no effect in production.

---

## Whole-app system-design style questions (senior-leaning, good to have a 30-second answer ready)

- **"How would you structure a large React + Redux Toolkit app?"** → Feature folders (slice + components + RTK Query endpoints colocated per feature), shared `components/`/`hooks/` for cross-cutting UI/logic, typed store (`RootState`/`AppDispatch`), route-based code-splitting, Error Boundaries per major section.
- **"How would you optimize a slow list of 10,000 rows?"** → Profile first; then virtualization (`react-window`), `React.memo` on row components with stable `key`s and memoized callbacks, avoid unnecessary derived state recalculation (memoize with `useMemo`).
- **"How do you handle authentication across the app?"** → Auth state in Redux (or a small `AuthContext` if simple), protected routes via a wrapper component, tokens attached via an Axios interceptor or RTK Query's `prepareHeaders`, redirect-on-401 handling.
- **"How do you avoid prop drilling without over-using Context?"** → Composition (`children`), colocate state closer to where it's used, or lift genuinely shared state into Redux Toolkit rather than threading it through many components.

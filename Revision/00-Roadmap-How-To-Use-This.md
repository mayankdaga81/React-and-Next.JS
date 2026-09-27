# React Revision Roadmap — Read This First

**Goal of this folder:** a single, one-time-effort, self-contained "reset button" for React. If you forget everything again after a year of not touching it, come back here, read top to bottom, and you'll be interview-ready again in days, not months.

**Your starting point when you read this:** treat yourself as a total beginner. Every file explains concepts from zero — what it is, why it exists, how to use it, common mistakes, and the interview questions asked about it.

---

## How this folder is organized

Two tiers, ordered by **how often you'll actually use the concept in a real job (React 19 + Redux Toolkit + TypeScript stack)**, not by textbook order.

### 🟢 Tier 1 — Daily-driver concepts (study these first, in this order)

| #   | File                                                                                   | Covers                                                                                                               |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | [01-JSX-Components-Props-State.md](01-JSX-Components-Props-State.md)                   | JSX, components, rendering rules, props, `useState`, controlled inputs, lists & keys, conditional rendering          |
| 2   | [02-Core-Hooks.md](02-Core-Hooks.md)                                                   | `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext` — the hooks you'll write every single week |
| 3   | [03-Event-Handling-and-Forms.md](03-Event-Handling-and-Forms.md)                       | Synthetic events, controlled vs uncontrolled forms, `react-hook-form` + `zod` validation                             |
| 4   | [04-React-Router.md](04-React-Router.md)                                               | Client-side routing with `react-router-dom` v6/v7 — routes, nested routes, params, navigation, protected routes      |
| 5   | [05-Redux-Toolkit.md](05-Redux-Toolkit.md)                                             | `configureStore`, `createSlice`, `useSelector`/`useDispatch`, `createAsyncThunk`, RTK Query                          |
| 6   | [06-Data-Fetching-and-Async.md](06-Data-Fetching-and-Async.md)                         | `fetch`/`axios`, loading/error/race-condition patterns, RTK Query deep dive, custom data hooks                       |
| 7   | [07-Component-Patterns-and-Custom-Hooks.md](07-Component-Patterns-and-Custom-Hooks.md) | Composition, `children`, building your own hooks, folder structure conventions                                       |
| 8   | [08-Performance-Optimization.md](08-Performance-Optimization.md)                       | `React.memo`, `useMemo`/`useCallback` correctly, code-splitting (`lazy`/`Suspense`), list virtualization, Profiler   |
| 9   | [09-TypeScript-with-React.md](09-TypeScript-with-React.md)                             | Typing props/state/events/hooks/refs, generics, typing Redux Toolkit                                                 |
| 10  | [10-Testing-React-Apps.md](10-Testing-React-Apps.md)                                   | React Testing Library + Jest/Vitest, mocking, testing hooks and Redux-connected components                           |

### 🟡 Tier 2 — Good-to-know / interview theory (study after Tier 1 feels solid)

| #   | File                                                                                       | Covers                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11  | [11-Context-API.md](11-Context-API.md)                                                     | Context API deep dive (you don't use it daily, but every interview asks about it and how it compares to Redux)                                                                              |
| 12  | [12-Advanced-Hooks.md](12-Advanced-Hooks.md)                                               | `useReducer`, `useLayoutEffect`, `useImperativeHandle`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, React 19 additions (`use`, `useActionState`, `useOptimistic`) |
| 13  | [13-Refs-Portals-ErrorBoundaries-Suspense.md](13-Refs-Portals-ErrorBoundaries-Suspense.md) | `forwardRef`, Portals, Error Boundaries, `Suspense` for data                                                                                                                                |
| 14  | [14-Legacy-Patterns-and-Class-Components.md](14-Legacy-Patterns-and-Class-Components.md)   | Class components & lifecycle methods, HOCs, render props — asked in interviews, rarely written now                                                                                          |
| 15  | [15-React-Internals-Virtual-DOM-and-Fiber.md](15-React-Internals-Virtual-DOM-and-Fiber.md) | Virtual DOM, reconciliation, Fiber, batching, Strict Mode, keys deep dive — the "how does React work under the hood" questions                                                              |
| 16  | [16-Styling-Approaches.md](16-Styling-Approaches.md)                                       | Tailwind, CSS Modules, styled-components — quick comparison                                                                                                                                 |

### 📌 Reference

| File                                                           | Purpose                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [99-Interview-Question-Bank.md](99-Interview-Question-Bank.md) | Rapid-fire Q&A across every topic — use this the night before an interview |

---

## How to actually use this (recommended flow)

1. **First pass (understand):** Read Tier 1 files in order, top to bottom. Don't skip the "Common Mistakes" and "Interview Questions" sections — that's where the real learning is.
2. **Second pass (practice):** Every file ends with a **Practice Task**. Do it in a scratch project (or reuse the numbered folders like `02. Counter State`, `03. Queue Management` etc. in this repo — they already demonstrate most Tier-1 concepts). Don't just read the code, type it out yourself.
3. **Third pass (interview mode):** Once Tier 1 is comfortable, skim Tier 2 for theory — you mostly need to _talk about_ these in interviews, not necessarily use them daily.
4. **Before an interview:** Do a final speed-run through [99-Interview-Question-Bank.md](99-Interview-Question-Bank.md).

## Why this order (the reasoning, so future-you trusts it)

- **Context API is Tier 2, not Tier 1** — because your actual job uses Redux Toolkit for global state. Context is still explained in depth (interviewers love asking "Context vs Redux"), just not first.
- **Redux Toolkit is Tier 1** — it's your team's real state manager. `createSlice`, `useSelector`, `useDispatch`, `createAsyncThunk`, and RTK Query are things you'll write constantly.
- **`useReducer` is Tier 2** — conceptually it's "Redux for a single component," and once you know Redux Toolkit, `useReducer` is a 10-minute add-on, not a separate multi-week topic.
- **TypeScript and Testing are Tier 1** — because in a real professional codebase you almost never write plain JS without types or ship a component with zero tests.
- **Class components / HOCs / render props are Tier 2** — you will basically never write these in new code (2024+ codebases are 100% function components + hooks), but interviewers — especially at companies with older codebases — still ask about them, so they're covered, just later.

## What already exists in this repo (don't relearn from scratch, cross-reference it)

- `01. Start/`, `02. Counter State/`, `03. Queue Management/`, `04. Prop Guide/`, `05. Custom Hooks/`, `06. Zustand/` — working code + notes for components, props, `useState`, controlled forms, Context API, custom hooks, and Zustand (an alternative lightweight global-state library, good to mention as "I also know Zustand as a lighter alternative to Redux" in interviews).
- `07-first-next-js-app/`, `08-project1/` — Next.js is **out of scope** for this revision pass per your call — come back to it separately once core React + Redux Toolkit feels solid again.

---

Once you've been through all of Tier 1 and Tier 2 at least once, you are functionally interview-ready for a mid-level React role. Good luck — future you has already done the hard part once, this file just makes sure you don't have to do it from scratch again.

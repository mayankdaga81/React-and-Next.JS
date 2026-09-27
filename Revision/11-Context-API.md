# 11. Context API — Deep Dive

> Basic usage already shown in [02-Core-Hooks.md](02-Core-Hooks.md) §2.5 and this repo's [04. Prop Guide/Notes-Props-Context.md](../04.%20Prop%20Guide/Notes-Props-Context.md). This file goes deeper into _when_, _why_, and _performance pitfalls_ — because interviewers will absolutely ask "Context vs Redux."

## 11.1 What Problem Does Context Solve?

**Prop drilling**: passing a prop through many intermediate components that don't need it themselves, just to get it to a deeply nested child.

```
App → Layout → Sidebar → NavList → NavItem  (all just forwarding `user`)
```

Context lets `NavItem` read `user` directly without every component in between declaring/forwarding it.

## 11.2 Full Pattern (Provider + Hook)

```jsx
// context/ThemeContext.jsx
const ThemeContext = createContext(undefined); // undefined default helps catch "used outside provider" bugs

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const value = { theme, toggleTheme };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// custom hook wrapper — always do this instead of raw useContext everywhere
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

Why wrap in a custom hook (`useTheme`) instead of calling `useContext(ThemeContext)` directly everywhere? Centralizes the "used outside provider" guard, and hides the context object as an implementation detail.

## 11.3 The Big Performance Pitfall

**Every consumer of a context re-renders whenever the Provider's `value` changes** — even if the consumer only cares about part of that value.

```jsx
// ❌ new object every render → ALL consumers re-render every time ThemeProvider re-renders for ANY reason
<ThemeContext.Provider value={{ theme, toggleTheme }}>
```

Fix 1 — memoize the value:

```jsx
const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
```

Fix 2 — split into multiple contexts so unrelated state doesn't cause unrelated re-renders (e.g. separate `ThemeContext` and `AuthContext` instead of one giant `AppContext`).

Fix 3 — for very frequently-changing values (e.g. mouse position, scroll offset), Context is often the **wrong tool entirely** — that's what dedicated state libraries (Redux/Zustand with selector-based subscriptions) solve better, because they let each component subscribe to just the slice it needs without any of this manual splitting/memoizing.

## 11.4 Context vs Redux Toolkit vs Zustand (the interview answer, worth memorizing)

|                                | Context API                                                                   | Redux Toolkit                                                                                                             | Zustand                                            |
| ------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Built into React               | ✅ Yes                                                                        | ❌ (library)                                                                                                              | ❌ (library)                                       |
| Good for                       | Rarely-changing global values: theme, locale, auth flag, feature flags        | Complex, frequently-updating app state shared by many features, async-heavy apps, teams needing strict structure/devtools | Small-medium apps needing simple global state fast |
| Re-render granularity          | Coarse (whole subtree re-renders per Provider) unless manually split/memoized | Fine-grained via `useSelector`                                                                                            | Fine-grained via selector functions                |
| DevTools/time-travel debugging | None                                                                          | Excellent                                                                                                                 | Some (via middleware)                              |
| Built-in async handling        | None (roll your own)                                                          | Thunks + RTK Query                                                                                                        | None (roll your own)                               |
| Boilerplate                    | Low, but scales poorly                                                        | Low (thanks to RTK), scales well                                                                                          | Very low                                           |

**Interview soundbite:** _"Context is for dependency injection of rarely-changing values — not a general-purpose state manager. For frequently-updating shared app state, Redux Toolkit (or Zustand for smaller apps) is the right tool because of fine-grained subscriptions and built-in async/devtools support."_

## 11.5 Multiple Contexts Composed

```jsx
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Nesting order rarely matters unless one provider's logic depends on another (e.g. `CartProvider` reading `useAuth()` internally).

---

## ⚠️ Common Mistakes

1. Passing a new object/array literal as `value` every render → unnecessary re-renders of every consumer.
2. Using one giant Context for the entire app's state instead of splitting by concern.
3. Calling `useContext` without checking for `undefined` (forgetting the app might render the consumer outside its provider — easy to catch with the custom-hook-with-guard pattern above).
4. Using Context for state that changes very frequently (e.g. every keystroke, animation frame) — causes broad re-render storms.

## 🎤 Interview Questions

1. **What problem does Context solve?** → Prop drilling — sharing data across many nesting levels without manually forwarding it through every intermediate component.
2. **What's the main performance pitfall of Context?** → Every consumer re-renders whenever the Provider's value changes, since Context has no fine-grained per-field subscription like a selector-based store does.
3. **How do you avoid unnecessary Context re-renders?** → Memoize the `value` object with `useMemo`, and/or split one large context into several smaller, more focused ones.
4. **Context vs Redux — when would you choose each?** → Context for rarely-changing, simple global values; Redux Toolkit for complex, frequently-changing app state needing async handling, fine-grained re-render control, and devtools.
5. **Why wrap `useContext` in a custom hook?** → Centralizes the "must be used within its provider" runtime check and hides the raw context object as an implementation detail.

## ✅ Practice Task

Build an `AuthContext` (`user`, `login()`, `logout()`) and a `ThemeContext`, compose both as providers around a small app, and deliberately reproduce the re-render pitfall (log renders in an unrelated consumer while toggling theme) — then fix it with `useMemo` and confirm the unrelated consumer stops re-rendering.

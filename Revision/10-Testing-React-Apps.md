# 10. Testing React Apps (React Testing Library + Jest/Vitest)

## 10.1 Philosophy: Test Behavior, Not Implementation

React Testing Library (RTL)'s core principle: **"The more your tests resemble the way your software is used, the more confidence they can give you."** Don't test internal state or instance methods — query the DOM the way a user would (by visible text, label, role) and interact with it the way a user would (click, type).

## 10.2 Setup Basics (Vitest, common with Vite projects — Jest works almost identically)

```
npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## 10.3 Basic Component Test

```jsx
// Counter.jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

```jsx
// Counter.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Counter from "./Counter";

describe("Counter", () => {
  it("starts at 0 and increments on click", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

## 10.4 Query Priority (how you should pick a query, in order)

1. `getByRole` (best — mirrors accessibility tree, e.g. `getByRole("button", { name: /submit/i })`)
2. `getByLabelText` (great for form fields)
3. `getByPlaceholderText`, `getByText`
4. `getByTestId` (last resort — `data-testid="..."`, use only when nothing semantic is available)

`get*` throws if not found (assert existence) · `query*` returns `null` if not found (assert **absence**) · `find*` is async, waits for the element to appear (for stuff that shows up after an effect/API call).

```jsx
expect(screen.queryByText("Error")).not.toBeInTheDocument(); // asserting something is NOT there
const item = await screen.findByText("Loaded data"); // waits for async render
```

## 10.5 Testing Forms

```jsx
it("shows validation error on empty submit", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  await user.click(screen.getByRole("button", { name: /submit/i }));
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```

## 10.6 Mocking API Calls

```jsx
import { vi } from "vitest";

vi.mock("../api/userApi", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Mayank" }),
}));
```

For more realistic API mocking across many tests, the industry standard is **MSW (Mock Service Worker)** — it intercepts actual network requests at the network level, so components/hooks don't need any code changes to be testable.

```js
// handlers.js
import { http, HttpResponse } from "msw";
export const handlers = [
  http.get("/api/user/:id", () => HttpResponse.json({ id: 1, name: "Mayank" })),
];
```

## 10.7 Testing Components Connected to Redux

Wrap in a real (or test-configured) `<Provider>` with a fresh store per test — don't mock Redux itself, test the real integration.

```jsx
function renderWithStore(ui, preloadedState) {
  const store = configureStore({ reducer: rootReducer, preloadedState });
  return render(<Provider store={store}>{ui}</Provider>);
}

it("dispatches increment on click", async () => {
  const user = userEvent.setup();
  renderWithStore(<Counter />, { counter: { value: 5 } });
  expect(screen.getByText("5")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "+" }));
  expect(screen.getByText("6")).toBeInTheDocument();
});
```

## 10.8 Testing Custom Hooks

```jsx
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./useToggle";

it("toggles the boolean value", () => {
  const { result } = renderHook(() => useToggle(false));
  expect(result.current[0]).toBe(false);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});
```

## 10.9 What NOT to Test

- Internal state values directly (test what the user sees/does instead).
- Third-party library internals (e.g. don't test that `react-hook-form` validates correctly — trust the library, test _your_ validation schema/behavior).
- Implementation details like class names/CSS unless behaviorally relevant.

---

## ⚠️ Common Mistakes

1. Querying by CSS class or DOM structure instead of role/label/text → brittle tests that break on refactors that don't change behavior.
2. Forgetting `await` on `userEvent` interactions (v14+ `userEvent` methods are async).
3. Using `getBy*` to assert something is absent — it throws instead of returning `null`; use `queryBy*` for absence checks.
4. Not resetting mocks/store between tests → test pollution (leftover state from a previous test).
5. Testing implementation details (e.g. asserting a particular internal function was called) rather than the resulting DOM/behavior.

## 🎤 Interview Questions

1. **What is React Testing Library's guiding philosophy?** → Test components the way a user interacts with them, not their internal implementation.
2. **`getBy` vs `queryBy` vs `findBy`?** → `getBy` throws if absent (existence assertions); `queryBy` returns `null` if absent (absence assertions); `findBy` is async and waits for the element (post-effect/async UI).
3. **How do you test a component that calls an API?** → Mock the network layer (MSW or a mocked module) and assert on the resulting rendered UI (loading → data/error state), using `findBy*` to wait for the async update.
4. **How do you test a component connected to Redux?** → Render it wrapped in a real `<Provider>` with a test store (optionally with `preloadedState`), not a mocked Redux.
5. **Why prefer `getByRole` over `getByTestId`?** → It mirrors what real users/assistive technology perceive (better test confidence + a free accessibility check), whereas `data-testid` has no relation to real user experience.

## ✅ Practice Task

Write full RTL + Vitest tests for the Todo app you built for the Redux Toolkit practice task in [05-Redux-Toolkit.md](05-Redux-Toolkit.md): rendering with a preloaded store, adding a todo, toggling it, removing it, and an async test for the `fetchTodos` thunk using a mocked fetch.

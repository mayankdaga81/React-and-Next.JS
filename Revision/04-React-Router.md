# 4. React Router (`react-router-dom`)

Plain React has **no built-in routing** — `react-router-dom` is the de-facto standard for client-side routing in single-page apps (Next.js's file-based router replaces this, but that's out of scope here).

## 4.1 Basic Setup

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} /> {/* catch-all 404 */}
      </Routes>
    </BrowserRouter>
  );
}
```

- `BrowserRouter` — uses real browser History API (clean URLs). `HashRouter` uses `#` (rarely needed today).
- `Routes` — picks the **first matching** `Route` (order matters less than specificity in v6+, but keep `*` last).
- `Route path="/users/:id"` — `:id` is a **dynamic segment / URL parameter**.

## 4.2 Navigation

```jsx
import { Link, NavLink, useNavigate } from "react-router-dom";

<Link to="/about">About</Link>
<NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>

function LoginButton() {
  const navigate = useNavigate();
  function handleLogin() {
    // ...after successful login
    navigate("/dashboard", { replace: true }); // replace: don't add to history stack
  }
}
```

- Use `<Link>`/`<NavLink>` instead of `<a>` — avoids a full page reload.
- `useNavigate()` — programmatic navigation (after form submit, redirects, etc.).

## 4.3 Reading URL Params & Query Strings

```jsx
import { useParams, useSearchParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams(); // from "/users/:id"
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page"); // from "?page=2"
}
```

## 4.4 Nested Routes & Layouts

```jsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>;

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* renders the matched child route here */}
    </>
  );
}
```

- `<Outlet />` is where the matched nested route renders — this is how a shared navbar/sidebar persists across pages.
- `index` route = the default child shown at the parent's exact path.

## 4.5 Protected / Private Routes

```jsx
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

`<Navigate to="..." />` — declarative redirect (renders nothing, just redirects).

## 4.6 Loaders/Actions (modern "data router" APIs — good to know exists)

Newer React Router (v6.4+/v7 `createBrowserRouter`) supports `loader`/`action` functions per route to fetch data before render — conceptually similar to Next.js data fetching. Mention-worthy in interviews, but RTK Query is what you'll actually reach for at work.

---

## ⚠️ Common Mistakes

1. Using `<a href="...">` instead of `<Link>` → causes full page reload, loses SPA benefits.
2. Forgetting `*` catch-all route → blank page on unknown URLs instead of a proper 404.
3. Not wrapping the whole app in a single `<BrowserRouter>` (only one should exist, at the top).
4. Confusing `useParams` (URL path segments) with `useSearchParams` (query string `?key=value`).

## 🎤 Interview Questions

1. **How does client-side routing avoid full page reloads?** → It intercepts navigation, uses the History API (`pushState`) to change the URL, and re-renders only the matched route's component — no full document reload.
2. **`useParams` vs `useSearchParams`?** → Params = dynamic path segments (`/users/:id`); search params = query string (`?sort=asc`).
3. **What does `<Outlet/>` do?** → Renders the currently matched nested/child route inside a parent layout route.
4. **How do you implement a protected route?** → A wrapper component that checks auth state and either renders `children`/`<Outlet/>` or `<Navigate to="/login"/>`.
5. **Why `replace: true` on `navigate()` after login?** → So the login page isn't in browser history (user can't hit "back" into it after auth).

## ✅ Practice Task

Build a mini app with:

- `/`, `/products`, `/products/:id`, `/login`, `/dashboard` (protected).
- A shared `<Navbar>` via a layout route + `<Outlet/>`.
- A fake `isAuthenticated` boolean in Redux/Zustand controlling access to `/dashboard`, redirecting to `/login` otherwise.
- A catch-all 404 page.

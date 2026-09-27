# 6. Data Fetching & Async Patterns

## 6.1 The Manual Way — `fetch`/`axios` + `useEffect`

Already shown in [02-Core-Hooks.md](02-Core-Hooks.md). Key pieces to always include by hand:

- Loading state, error state, cancellation flag (avoid "setState after unmount"/race conditions).
- `axios` vs `fetch`: `axios` auto-parses JSON, has interceptors (great for attaching auth tokens / global error handling), better error objects. `fetch` is native, no install needed, but you must manually check `res.ok` and call `.json()`.

```js
// axios interceptor example — attach token to every request
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 6.2 Race Conditions (classic interview scenario)

If `id` changes quickly (e.g. user types fast in a search box), an **older** request might resolve _after_ a newer one, overwriting fresh data with stale data.

```js
useEffect(() => {
  let ignore = false;
  fetchData(id).then((res) => {
    if (!ignore) setData(res); // guard against stale response
  });
  return () => {
    ignore = true;
  };
}, [id]);
```

Or use `AbortController` to actually cancel the in-flight request:

```js
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });
  return () => controller.abort();
}, [query]);
```

## 6.3 RTK Query — Preferred at Work

RTK Query eliminates almost all of the above boilerplate: caching, loading/error state, refetching, cache invalidation, race-condition handling — all built in.

```js
// api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Todo"], // used for cache invalidation
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation({
      query: (newTodo) => ({ url: "/todos", method: "POST", body: newTodo }),
      invalidatesTags: ["Todo"], // auto refetch getTodos after this succeeds
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = apiSlice;
```

```jsx
function TodoList() {
  const {
    data: todos,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTodosQuery();
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>{t.text}</li>
      ))}
    </ul>
  );
}
```

Wire `apiSlice.reducer` and `apiSlice.middleware` into `configureStore`:

```js
export const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer /* ...other slices */ },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});
```

### Key concepts to be fluent in

- **`query` vs `mutation`** — query = GET/read (cached, auto-refetch-able); mutation = POST/PUT/DELETE (write, then usually invalidate related query cache).
- **`providesTags` / `invalidatesTags`** — the caching invalidation mechanism: a mutation invalidating a tag causes all queries providing that tag to automatically refetch.
- Auto-generated hooks: `use<EndpointName>Query` / `use<EndpointName>Mutation`.
- Built-in `isLoading`, `isFetching` (refetch in progress vs first load), `isError`, `isSuccess`, `data`, `error`.

## 6.4 Custom Data-Fetching Hook (when you don't want RTK Query)

```js
function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [url]);
  return state;
}
```

---

## ⚠️ Common Mistakes

1. Not handling the loading/error states at all (assuming happy path only).
2. Not cancelling stale requests → race conditions overwriting fresh data.
3. Re-fetching on every render because the fetch call/object is defined inline without proper `useEffect` deps.
4. Manually re-implementing caching/invalidation logic that RTK Query already provides for free.

## 🎤 Interview Questions

1. **How do you handle a race condition in data fetching?** → Ignore/discard stale responses via a cancellation flag, or actually cancel with `AbortController`; RTK Query/React Query handle this automatically.
2. **`fetch` vs `axios`?** → `axios`: auto JSON parsing, interceptors, nicer error handling, works in older environments; `fetch`: native, no dependency, more manual work.
3. **What problem does RTK Query solve?** → Removes hand-written loading/error/caching/race-condition boilerplate for server state; provides automatic caching & invalidation via tags.
4. **`providesTags` vs `invalidatesTags`?** → A query "provides" a tag (marks its cached data as belonging to that tag); a mutation "invalidates" a tag, forcing any query providing it to refetch.
5. **Difference between `isLoading` and `isFetching` in RTK Query?** → `isLoading` = true only during the very first fetch (no cached data yet); `isFetching` = true anytime a request is in flight, including background refetches.

## ✅ Practice Task

Convert the manual `fetchUser` thunk from [05-Redux-Toolkit.md](05-Redux-Toolkit.md)'s practice task into an RTK Query `getUser` query, wire it into the store, and replace the component's `useSelector`/`dispatch` calls with the generated `useGetUserQuery` hook. Compare how much boilerplate disappeared.

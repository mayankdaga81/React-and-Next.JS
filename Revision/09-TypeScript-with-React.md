# 9. TypeScript with React

## 9.1 Typing Props

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary"; // optional, union of literals
  onClick: () => void;
  disabled?: boolean;
};

function Button({
  label,
  variant = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button className={variant} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

- `type` vs `interface` for props: either works; `interface` is extendable (`extends`), `type` supports unions more naturally. Pick one convention and stay consistent (most teams use `type` for props today).
- Optional props: `variant?: string`. Required props: no `?`.

## 9.2 Typing `children`

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode; // accepts anything renderable: string, JSX, array, null...
};

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

`React.ReactNode` is the broadest, safest type for `children`. Avoid `JSX.Element` for `children` unless you specifically require exactly one element.

## 9.3 Typing `useState`

```tsx
const [count, setCount] = useState<number>(0); // usually inferred automatically from 0
const [user, setUser] = useState<User | null>(null); // MUST annotate when initial value doesn't reveal the full type
const [items, setItems] = useState<Item[]>([]);
```

## 9.4 Typing Events

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.currentTarget);
}
```

Pattern: `React.<EventType><HTMLElementType>` — memorize `ChangeEvent`, `FormEvent`, `MouseEvent`, `KeyboardEvent`.

## 9.5 Typing `useRef`

```tsx
const inputRef = useRef<HTMLInputElement>(null); // DOM ref — pass `null` as initial value
inputRef.current?.focus(); // `?.` because it can be null before mount

const countRef = useRef<number>(0); // mutable value ref, not null-based
```

## 9.6 Typing Custom Hooks

```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

Explicit tuple return type (`[boolean, () => void]`) ensures destructuring order/types are correct at call sites — without it, TS may infer `(boolean | (() => void))[]`, losing positional typing.

## 9.7 Typing Redux Toolkit (very commonly asked given your stack)

```ts
// store.ts
export const store = configureStore({ reducer: { counter: counterReducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// hooks.ts — typed versions of useSelector/useDispatch, used everywhere instead of the plain ones
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```tsx
const count = useAppSelector((state) => state.counter.value); // fully typed, autocomplete works
```

Slice state typing:

```ts
type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});
```

## 9.8 Generic Components

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// usage — T is inferred as `User`
<List items={users} renderItem={(u) => <span>{u.name}</span>} />;
```

## 9.9 Utility Types You'll Actually Use

- `Partial<T>` — all props optional (great for update/patch functions).
- `Pick<T, "a" | "b">` / `Omit<T, "a">` — subset of a type.
- `Record<string, T>` — dictionary/map type.
- `ReturnType<typeof fn>` — infer a function's return type (used above for `RootState`).

---

## ⚠️ Common Mistakes

1. Typing `useState(null)` without a generic → TS infers `null` forever, can't assign the real value later. Fix: `useState<User | null>(null)`.
2. Forgetting `?.` when accessing `ref.current` typed as possibly `null`.
3. Using the untyped `useSelector`/`useDispatch` from `react-redux` directly instead of the app's typed wrappers (`useAppSelector`/`useAppDispatch`).
4. Typing `children` as `JSX.Element` instead of `React.ReactNode`, rejecting valid children like strings/arrays/`null`.

## 🎤 Interview Questions

1. **How do you type a component's props?** → Define a `type`/`interface` for the props object and annotate the destructured parameter.
2. **Why annotate `useState<User | null>(null)` explicitly?** → Without it TS infers the type purely from the initial value (`null`), preventing you from ever assigning a `User` later.
3. **How do you create typed versions of `useSelector`/`useDispatch`?** → Export `RootState`/`AppDispatch` types from the store, then create `useAppSelector`/`useAppDispatch` typed wrappers used everywhere instead of the raw hooks.
4. **What type do you use for the `children` prop?** → `React.ReactNode`.
5. **How do you type a generic reusable component like a `<List>`?** → Use a generic type parameter `<T>` on the props type and the function component itself.

## ✅ Practice Task

Convert the Redux Toolkit Todo practice project from [05-Redux-Toolkit.md](05-Redux-Toolkit.md) to TypeScript: type the slice state, actions (`PayloadAction<...>`), `RootState`/`AppDispatch`, typed hooks, and prop types for every component involved.

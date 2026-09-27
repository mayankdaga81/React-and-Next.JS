# 3. Event Handling & Forms

## 3.1 Synthetic Events

React wraps native DOM events in a **SyntheticEvent** — a cross-browser wrapper with the same interface everywhere.

```jsx
function Button() {
  function handleClick(e) {
    e.preventDefault(); // works just like native
    console.log(e.target); // the DOM node that triggered it
  }
  return <button onClick={handleClick}>Click</button>;
}
```

- Event handlers are named `onClick`, `onChange`, `onSubmit` (camelCase), not `onclick`.
- Passing a function **reference** vs calling it:
  ```jsx
  onClick={handleReset}          // ✅ reference — called by React on click
  onClick={handleReset()}        // ❌ calls it immediately during render
  onClick={() => handleDecrease(id)} // ✅ wrap in arrow fn when you need to pass args
  ```
- React attaches most events at the **root** (event delegation) for performance, not on each individual DOM node.

---

## 3.2 Controlled vs Uncontrolled Inputs

**Controlled** (React state is the source of truth — the standard approach):

```jsx
const [value, setValue] = useState("");
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

**Uncontrolled** (DOM holds the value, you read it via ref when needed — useful for simple/one-off forms or file inputs):

```jsx
const inputRef = useRef(null);
<input ref={inputRef} defaultValue="" />;
// later: inputRef.current.value
```

|                         | Controlled      | Uncontrolled                                                             |
| ----------------------- | --------------- | ------------------------------------------------------------------------ |
| Source of truth         | React state     | DOM                                                                      |
| Re-renders on keystroke | Yes             | No                                                                       |
| Validation as you type  | Easy            | Harder                                                                   |
| Good for                | Most real forms | File inputs, simple/non-validated forms, integrating with non-React code |

---

## 3.3 Basic Form Submission

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stop full-page reload
    // validate + submit
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

This gets messy fast for real forms (multiple fields, validation, error messages, touched/dirty state) — which is why real projects use a form library.

---

## 3.4 `react-hook-form` (the industry-standard form library)

Why: minimizes re-renders (uncontrolled under the hood via refs), built-in validation, easy integration with schema validators like **Zod** or **Yup**.

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await api.login(data); // data = { email, password }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

Key API surface to remember:

- `register("fieldName")` — wires an input up (name, ref, onChange, onBlur) without you managing state manually.
- `handleSubmit(onValid, onInvalid?)` — runs validation first, calls your callback only if valid.
- `formState.errors` — validation error messages per field.
- `watch()` — subscribe to a field's live value when you need it (e.g., conditional fields).
- `Controller` — needed to wire up **non-native/controlled UI library inputs** (e.g. a custom `<Select>` component) that don't expose a plain DOM `ref`.
- `reset()` — reset the form (e.g. after successful submit).

---

## ⚠️ Common Mistakes

1. Forgetting `e.preventDefault()` on form submit → full page reload.
2. Managing every field with individual `useState` for a large form → re-renders on every keystroke, verbose code. Use `react-hook-form` instead.
3. Re-creating the validation schema object inside the component body on every render (define it outside the component).
4. Mixing controlled and uncontrolled on the same input (e.g. providing `value` without `onChange`) → React warning "changing an uncontrolled input to be controlled."

---

## 🎤 Interview Questions

1. **What is a SyntheticEvent?** → React's cross-browser wrapper around native DOM events, normalizing behavior.
2. **Controlled vs uncontrolled components — difference and trade-offs?** → Controlled: React state drives the value, easy validation, more re-renders. Uncontrolled: DOM drives value, read via ref, fewer re-renders, harder to validate live.
3. **Why prefer `react-hook-form` over manual `useState` per field?** → Fewer re-renders (uncontrolled internally), built-in validation integration, less boilerplate for large forms.
4. **How do you integrate schema validation (Zod/Yup) with `react-hook-form`?** → Via a `resolver` (`zodResolver(schema)` / `yupResolver(schema)`) passed to `useForm`.
5. **Why does React warn about "a component is changing an uncontrolled input to controlled"?** → The `value` prop went from `undefined` to a defined value across renders — always initialize controlled state to `""`/appropriate default, never `undefined`.

---

## ✅ Practice Task

Build a signup form with email, password, confirm-password fields using `react-hook-form` + `zod`:

- Email must be valid format.
- Password min 8 chars.
- Confirm-password must match password (`.refine()` in Zod).
- Disable submit button while submitting; show a success message after a fake `await` API call.

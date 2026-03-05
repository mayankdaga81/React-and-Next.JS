# Revision Notes – Queue Management

These notes correspond to the example in `03. Queue Management/src/`. Open the files side‑by‑side when reviewing.

---

## 📁 Project structure

```
03. Queue Management/
  ├─ src/
  │   ├─ App.jsx              ← main component, manages state
  │   └─ components/
  │       ├─ QueueForm.jsx    ← form to add customers
  │       └─ QueueDisplay.jsx ← displays queue and actions
  └─ index.css               ← global styles
```

---

## 🔄 Key concepts

### Lifting state up

When multiple components need to share or modify the same data, move the state to their common parent (`App.jsx`). Child components receive the data and update functions via props.

### Passing functions as props

Just like data, you can pass functions down to children. This allows child components to trigger updates in the parent.

```jsx
// In App.jsx
<QueueForm onAdd={addToQueue} />;

// In QueueForm.jsx
function QueueForm({ onAdd }) {
  // Call onAdd to update parent's state
}
```

### Controlled components

Form inputs are "controlled" when their value is tied to React state. Changes update the state, keeping the UI in sync.

```jsx
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />;
```

### Form submission

Use `e.preventDefault()` to stop the browser's default form behavior (page reload). Validate and process data in the handler.

### Conditional rendering

Show/hide elements based on conditions. Use `&&` for simple cases or ternary operators.

```jsx
{
  queue.length === 0 ? <p>No customers</p> : <QueueList />;
}
```

### Rendering lists with keys

When mapping arrays to JSX, provide a unique `key` prop. React uses it to track items and optimize updates.

```jsx
{
  queue.map((customer) => <div key={customer.id}>...</div>);
}
```

### Immutable state updates

Never mutate state directly. Use spread syntax or array methods to create new copies.

```jsx
// Adding
setQueue([...queue, newItem]);

// Updating
setQueue(
  queue.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
);

// Removing
setQueue(queue.filter((item) => item.id !== id));
```

---

## 📋 App.jsx walkthrough

- **State**: `queue` array holds customer objects.
- **addToQueue**: Adds a new customer with generated `id` and `status: "Waiting"`.
- **updateStatus**: Changes a customer's status using `map`.
- **removeFromQueue**: Removes a customer using `filter`.
- **Props**: Passes `queue` and handlers to child components.

## 📝 QueueForm.jsx walkthrough

- **State**: Local state for `name` and `service`.
- **Form**: Controlled inputs; on submit, validates, calls `onAdd`, and resets fields.
- **Shorthand**: `{name, service}` creates an object with those properties.

## 📊 QueueDisplay.jsx walkthrough

- **Props**: Receives `queue`, `onUpdateStatus`, `onRemove`.
- **Conditional**: Shows "No Customer Data" if queue is empty.
- **Mapping**: Renders each customer with unique `key={customer.id}`.
- **Actions**: Buttons conditionally shown based on status; call prop functions.

---

## 💡 Additional notes

- Icons from `react-icons` add visual flair without extra CSS.
- Status colors use CSS variables for consistency.
- This pattern (state in parent, props to children) scales well for larger apps.

---

Happy revising! Keep exploring the code for deeper insights. 🚀

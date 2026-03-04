# Revision Notes – Components, Props & JSX

This document lives alongside the example project in `01. Start`. Whenever you want to revisit the code, look in `01. Start/src` and the `components` folder.

---

## 📁 Folder Structure

```
01. Start/
  ├─ src/
  │   ├─ App.jsx          ← main application
  │   ├─ components/      ← all custom components
  │   │    ├─ Card.jsx
  │   │    ├─ Button.jsx
  │   │    └─ Feature.jsx ← copied from Tailwind UI
  │   └─ ...
  └─ public/             ← static assets
```

Keeping components in their own directory makes reuse easier.

---

## 🔧 What is a Component?

A component is any piece of code that:

1. Contains meaningful logic or markup
2. Renders something visible on the website

**Convention:** component filenames start with an uppercase letter (e.g. `Card.jsx`, not `card.jsx`).

---

## ✨ JSX

JSX is the syntax used in React that looks like a mixture of HTML and JavaScript. Example:

```jsx
function Card() {
  return (
    <div className="p-4 bg-white shadow">
      <h2 className="text-lg font-bold">Hello</h2>
    </div>
  );
}
```

The returned markup is actually JavaScript objects under the hood.

---

## 🎁 Props (Properties)

Props are how data gets passed _into_ components. They let you render dynamic content or run logic based on the inputs.

### Passing props

```jsx
// App.jsx
<Card title="Welcome" description="This is a prop example" />
```

### Receiving props (normal)

```jsx
function Card(props) {
  return <h1>{props.title}</h1>;
}
```

### Receiving via destructuring (preferred)

```jsx
function Card({ title, description }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
```

Destructuring avoids repeating `props.` and makes the code cleaner.

### Reuse example

Because `Card` accepts props, you can render many different cards:

```jsx
<Card title="First" description="Foo" />
<Card title="Second" description="Bar" />
```

Same applies to the `Button` component – pass `label`, `onClick`, etc.

---

## ♻️ Reusing Components

Instead of hard–coding markup in `App.jsx`, import and render components:

```jsx
import Card from "./components/Card";
import Button from "./components/Button";

function App() {
  return (
    <div>
      <Card title="A" description="one" />
      <Card title="B" description="two" />
      <Button label="Click me" />
    </div>
  );
}
```

This keeps your code DRY and easier to maintain.

---

## 🌐 Using Tailwind UI Blocks

You can copy pre-built components from [Tailwind UI](https://tailwindui.com) or the free UI Blocks section.

- Example: `Feature.jsx` in the components folder is a direct paste of a block.
- Import it wherever you need that layout, just like a custom component:

```jsx
import Feature from "./components/Feature";

function App() {
  return (
    <div>
      <Feature />
    </div>
  );
}
```

Because Tailwind classes are just utility classes, the imported block works out of the box.

---

## ✅ Summary

- **Component** = re‑usable piece of UI + logic, must be uppercase.
- **JSX** = HTML-like syntax in JavaScript.
- **Props** = data passed into components; destructure to simplify access.
- **Reuse** components by importing them and passing different props.
- **Tailwind UI** blocks can be pasted into components and used like any other component.

Keep this note next to the project so you can quickly refer back when exploring the code.

---

Happy revising! 💡

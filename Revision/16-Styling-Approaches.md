# 16. Styling Approaches — Quick Comparison

You've already used **Tailwind CSS** extensively in this repo (`01. Start`, `06. Zustand`, etc.) — this file is a short comparison so you can speak to alternatives in interviews.

## 16.1 Plain CSS / CSS Modules

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
}
```

```jsx
import styles from "./Button.module.css";
<button className={styles.button}>Click</button>;
```

- Scoped automatically per-component (class names are hashed) — no global collisions.
- Familiar CSS syntax, no new tooling to learn beyond the `.module.css` naming convention.

## 16.2 Utility-First — Tailwind CSS (what you already use)

```jsx
<button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
  Click
</button>
```

- Style directly in markup via composable utility classes — no separate CSS file, no naming things.
- Very fast iteration once you know the class vocabulary; consistent design tokens (spacing/colors) enforced by config.
- Downside: markup can look "busy"; mitigated with component extraction (`Button.jsx` wrapping the classes once) rather than repeating long class strings everywhere.

## 16.3 CSS-in-JS — styled-components / Emotion

```jsx
const Button = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.variant === "primary" ? "blue" : "gray")};
`;
<Button variant="primary">Click</Button>;
```

- Styles colocated with the component, can use props/JS logic directly in CSS.
- Runtime cost (styles generated/injected at runtime) unless using a compile-time variant (e.g. `vanilla-extract`, Panda CSS) — a common criticism vs Tailwind's build-time-only approach.

## 16.4 Quick Comparison Table

|                                | CSS Modules                      | Tailwind                                        | styled-components                               |
| ------------------------------ | -------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Learning curve                 | Low (plain CSS)                  | Medium (utility class vocabulary)               | Medium (template literals + props)              |
| Runtime cost                   | None                             | None (build-time)                               | Some (runtime style injection, unless compiled) |
| Colocation with component      | Separate file                    | Inline in JSX                                   | Same file, JS-native                            |
| Dynamic styling based on props | Manual (conditional class names) | Manual (conditional class strings, e.g. `clsx`) | Native (template literal interpolation)         |

**Interview soundbite:** _"I've primarily used Tailwind for speed and design consistency, but I understand CSS Modules for scoped vanilla CSS and CSS-in-JS (styled-components) for prop-driven dynamic styling — the choice mostly comes down to team convention and whether runtime styling cost matters for the project."_

## ✅ Practice Task

Re-style one existing component from `02. Counter State/` using CSS Modules instead of the current approach, purely to feel the workflow difference against Tailwind.

# React + Vite Setup (Complete Fresh System Notes)

---

## 1️⃣ Install Node.js (LTS)

Download from: https://nodejs.org

Verify installation:

```bash
node -v
npm -v
```

If both versions are visible → setup successful ✅

---

## 2️⃣ Create React App Using Vite

### ✅ Create in a NEW Folder

```bash
npm create vite@latest
```

Select:

- Project Name → your-app-name
- Framework → React
- Variant → JavaScript (or TypeScript)

Then run:

```bash
cd your-app-name
npm install
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

### ✅ Create Inside an EXISTING Folder

If folder already exists:

```bash
npm create vite@latest .
npm install
npm run dev
```

⚠️ `.` means use current folder (no subfolder created)

---

## 3️⃣ File Explanation

### index.html

Contains:

```html
<div id="root"></div>
```

React injects everything inside this div.

---

### main.jsx (Entry Point)

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### App.jsx

Main UI component.

---

### package.json

Important scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 4️⃣ Remove Default Vite UI (Clean Setup)

Replace entire `src/App.jsx` with:

```jsx
function App() {
  return <h1>Welcome to React with Mayank</h1>;
}

export default App;
```

Optional cleanup:

- Delete `src/assets/`
- Delete `src/App.css`
- Remove unused CSS imports from `main.jsx`

Minimal `main.jsx` (optional version):

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## 5️⃣ Install Tailwind CSS (Vite Setup)

### Step 1: Install Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

---

### Step 2: Update `vite.config.ts`

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

---

### Step 3: Add Tailwind Import in CSS

Create or update `src/style.css`:

```css
@import "tailwindcss";
```

---

### Step 4: Update `index.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/src/style.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

Now Tailwind classes should work.

---

## 6️⃣ Run Project

```bash
npm run dev
```

You should see:

```
Welcome to React with Mayank
```

---

## 7️⃣ Build for Production

```bash
npm run build
```

Creates a `dist/` folder (production-ready files).

Preview production build:

```bash
npm run preview
```

---

## 8️⃣ Important Commands Summary

| Command                | Purpose                  |
| ---------------------- | ------------------------ |
| npm create vite@latest | Create project           |
| npm install            | Install dependencies     |
| npm run dev            | Start dev server         |
| npm run build          | Production build         |
| npm run preview        | Preview production build |

---

## 🧠 Mental Model

- index.html → has root div
- main.jsx → injects App into root
- App.jsx → your UI
- Vite → dev server + bundler
- package.json → manages dependencies + scripts

---

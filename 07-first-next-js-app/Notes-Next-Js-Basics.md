# Next.js – Quick Revision Notes

## 1. What is Next.js?

**Next.js** is a **production-ready React framework** built by **Vercel** that provides additional structure and powerful features on top of React.

With **plain React**, developers must configure many things manually.  
**Next.js solves this by providing built-in solutions for common problems.**

---

# 2. Problems with Plain React

React by itself is only a **UI library**, so many important features are missing out of the box.

Common limitations:

- No built-in routing
- No SEO optimization
- No Server Side Rendering (SSR)
- No built-in performance optimizations
- No API routes (backend support)
- Manual code splitting
- Extra setup for production features

Because of this, developers usually install additional libraries like:

- `react-router`
- `redux`
- `seo tools`
- `custom backend`

---

# 3. What Next.js Provides

Next.js solves these problems by providing features **out of the box**:

- Server Side Rendering (SSR)
- File-based routing
- Built-in performance optimizations
- Automatic code splitting
- API routes (backend support)
- SEO optimization
- Image optimization
- Streaming & server components

This makes Next.js a **full-stack React framework**.

---

# 4. Router in Next.js

A **router** manages how users move between different pages in an application.

Example:

```
Home → About → Contact
```

Instead of configuring routes manually, **Next.js uses File-Based Routing**.

This means:

> The **folder structure automatically defines the routes**.

Example:

```
app/about/page.tsx
```

Route becomes:

```
/about
```

No manual routing configuration is required.

---

# 5. Types of Routers in Next.js

## 5.1 Pages Router (Older)

Older routing system.

Example:

```
pages/about.js
```

URL:

```
/about
```

Notes:

- Still supported
- Mostly used in older projects
- Learn mainly for **maintaining legacy projects**

---

## 5.2 App Router (Modern – Recommended)

Latest routing system introduced in newer versions of Next.js.

Uses the **`/app` directory**.

Example:

```
app/about/page.tsx
```

Key features:

- Supports **React Server Components**
- Supports **Server Actions**
- Better scalability
- Improved performance
- Modern architecture

✅ **Always use App Router for new projects.**

---

# 6. Installing Next.js

Create a new project:

```bash
npx create-next-app@latest
```

Choose the **recommended defaults** during setup.

Start the development server:

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

Edit the main page to see changes:

```
app/page.tsx
```

---

# 7. Important Folder Structure

Typical structure:

```
project
│
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── public
│
├── next.config.ts
├── .gitignore
```

---

# 8. Important Files

## `app/`

The **most important folder** in a Next.js App Router project.

All pages, layouts, and routes live here.

---

## `app/page.tsx`

Represents the **homepage**.

Route:

```
/
```

---

## `app/layout.tsx`

Defines the **shared layout** for the application.

Example responsibilities:

- Navbar
- Footer
- Global layout structure

It uses a `children` prop to render page content.

Example:

```tsx
export default function Layout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## `app/globals.css`

Global styles for the entire application.

---

## `public/`

Stores **static assets** such as:

- images
- icons
- fonts
- logos

Example:

```
public/logo.png
```

---

## `.gitignore`

Specifies files and folders that **should not be pushed to Git**.

Examples:

```
node_modules
.env
.next
```

---

## `next.config.ts`

Configuration file for customizing Next.js behavior.

Examples:

- environment variables
- image domains
- build settings

---

# 9. One-Line Summary

> **Next.js is a full-stack React framework that adds routing, server-side rendering, performance optimization, and backend capabilities on top of React.**

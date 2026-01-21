---
reference: https://registry.joyco.studio/toolbox/pr-guidelines#semantic-actions-navigation
---

# Semantic Elements for Actions vs Navigation

### What

- Use `<button>` for actions (submit, toggle, open modal, delete)
- Use `<a>`/`<Link>` for navigation (go to another page or section)
- Never use `<button>` styled as a link for navigation
- Never use `<a>` or `<div onClick>` for actions
- Links should always have a valid `href`

### Why

Using the correct semantic element ensures proper keyboard behavior and accessibility. Links support Cmd/Ctrl+click to open in new tabs, middle-click, and right-click context menus—buttons don't. Screen readers announce elements differently based on their role. Using `<div onClick>` loses all keyboard support and semantics. Getting this wrong breaks user expectations and accessibility.

### Good

```tsx
// Button for actions
<button onClick={handleSave}>Save Changes</button>
<button onClick={() => setOpen(true)}>Open Settings</button>
<button onClick={handleDelete}>Delete Item</button>

// Link for navigation
<Link href="/settings">Go to Settings</Link>
<a href="/docs/getting-started">Documentation</a>
<a href="#pricing">Jump to Pricing</a>

// Button that looks like a link (still an action)
<button className="text-blue-600 underline hover:text-blue-800" onClick={handleRetry}>
  Try again
</button>
```

### Bad

```tsx
// Button used for navigation - can't Cmd+click to open in new tab
<button onClick={() => router.push('/settings')}>
  Go to Settings
</button>

// Link used for action - semantically incorrect
<a onClick={handleDelete}>Delete</a>
<a href="#" onClick={handleSave}>Save</a>

// Div with click handler - no keyboard support, no semantics
<div onClick={handleSubmit} className="cursor-pointer">
  Submit
</div>

// Link without href - not focusable, not a real link
<a onClick={() => setOpen(true)}>Open Modal</a>
```

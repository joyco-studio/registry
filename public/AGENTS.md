## Context Over Prop Drilling

Use React Context to share state and callbacks across deeply nested components instead of passing props through multiple layers. When logic depends on shared state, define those callbacks in the provider and expose them via context, so leaf components can call them directly. This avoids "pass-through" props, keeps component signatures small.

## Data Slot Approach

Use `data-slot` attributes for inner elements and keep a single `className` on the root. Avoid multiple `*ClassName` props; style internals from the parent with selectors like `**:data-[slot=name]` to keep component APIs tidy while remaining flexible.

## Use max-{breakpoint} variants for responsive hiding

When hiding elements below specific breakpoints, use Tailwind's max-{breakpoint} variants with the `hidden` class while keeping the default display value intact (e.g., `flex max-sm:hidden`). This approach prevents consumers from accidentally overriding the component's display behavior, as they might incorrectly assume the base state and apply conflicting classes like `hidden sm:block`.

## Semantic Elements for Actions vs Navigation

Use `<button>` for actions (submit, toggle, open modal) and `<a>`/`<Link>` for navigation. Never use `<button>` styled as a link for navigation, and never use `<a>` or `<div onClick>` for actions. This ensures proper keyboard behavior, accessibility, and allows users to Cmd/Ctrl+click or middle-click links to open in new tabs.

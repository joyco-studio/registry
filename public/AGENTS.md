# AGENTS

## Context Over Prop Drilling

Use React Context to share state and callbacks across deeply nested components instead of passing props through multiple layers. When logic depends on shared state, define those callbacks in the provider and expose them via context, so leaf components can call them directly. This avoids "pass-through" props, keeps component signatures small.

## Data Slot Approach

Use `data-slot` attributes for inner elements and keep a single `className` on the root. Avoid multiple `*ClassName` props; style internals from the parent with selectors like `**:data-[slot=name]` to keep component APIs tidy while remaining flexible.

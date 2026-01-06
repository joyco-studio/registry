## Context Over Prop Drilling

Use React Context to share state and callbacks across deeply nested components instead of passing props through multiple layers. When logic depends on shared state, define those callbacks in the provider and expose them via context, so leaf components can call them directly. This avoids "pass-through" props, keeps component signatures small.

## Data Slot Approach

Use `data-slot` attributes for inner elements and keep a single `className` on the root. Avoid multiple `*ClassName` props; style internals from the parent with selectors like `**:data-[slot=name]` to keep component APIs tidy while remaining flexible.

## Use max-{breakpoint} variants for responsive hiding

When hiding elements below specific breakpoints, use Tailwind's max-{breakpoint} variants with the `hidden` class while keeping the default display value intact (e.g., `flex max-sm:hidden`). This approach prevents consumers from accidentally overriding the component's display behavior, as they might incorrectly assume the base state and apply conflicting classes like `hidden sm:block`.

## Avoid JS-Based Media Queries for Initial Render

Never use JavaScript-based media queries (e.g., `window.matchMedia`, `useMediaQuery` hooks, or `innerWidth` checks) to determine layout or visibility of elements on first render. These cause layout shifts and flickers because the server cannot know the client's viewport size during SSR.

**Why this is problematic with SSR:**

1. **Hydration mismatch**: During SSR, JavaScript media queries default to a fallback value (often `false` or a desktop assumption). When React hydrates on the client, it recalculates the actual viewport, causing a mismatch between server-rendered HTML and client state.
2. **Layout shift (CLS)**: Users see content "jump" as elements resize, reposition, or toggle visibility after hydration—hurting Core Web Vitals and user experience.
3. **Flash of incorrect content**: On slow connections, users may see the wrong layout for several hundred milliseconds before JS executes and corrects it.

**Prefer CSS media queries instead:**

- Use Tailwind's responsive variants (`sm:`, `md:`, `lg:`, etc.) or plain CSS `@media` rules. These are evaluated by the browser immediately when parsing CSS, before any JavaScript runs, ensuring consistent rendering from the first paint.

**When JS-based media queries are acceptable:**

- In components that only render after user interaction (modals, dropdowns, tooltips).
- In client-only components explicitly marked with `"use client"` that are lazy-loaded or rendered after hydration (e.g., behind a `useEffect` or `Suspense` boundary).
- For non-visual logic that doesn't affect layout (analytics, feature flags based on device).

**Pattern for safe usage:**

```tsx
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

// Only use JS media query result after hydration
const isMobile = useMediaQuery("(max-width: 640px)");
const effectiveIsMobile = isClient ? isMobile : undefined;
```

If you must conditionally render based on viewport, render both variants in the markup and use CSS to show/hide, or ensure the component tree doesn't depend on the query result until after hydration.

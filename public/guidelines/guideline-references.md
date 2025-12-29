---
reference: false
---

# PR Guidelines Reference Rule

### What

When citing a guideline violation in code review comments, always include the reference URL. This URL must be **explicitly read from the `reference` frontmatter field** of the guideline file—never generate or invent URLs.

### Why

- Providing direct links helps developers quickly understand the rule and its context.
- Using the frontmatter `reference` field ensures the URL is accurate and maintained in one place.
- Generated or guessed URLs may be incorrect, broken, or non-existent.

### How

Each guideline file contains a `reference` frontmatter entry:

```md
---
reference: https://registry.joyco.studio/toolbox/pr-guidelines#naming-conventions
---
```

When referencing a violation, extract this value directly—do not construct or assume the URL.

### Exception

This guideline sets `reference: false` because it would create a circular self-reference. As the meta-guideline explaining _how_ to reference other guidelines, including a reference link to itself would be redundant. When a guideline has `reference: false`, it should not be cited with a reference link.

### Good

```
This violates Guideline: Naming Conventions
Reference: https://registry.joyco.studio/toolbox/pr-guidelines#naming-conventions

Variable names should use camelCase, not snake_case.
```

_(The reference URL was read directly from the guideline's frontmatter)_

### Bad

```
Variable names should use camelCase, not snake_case.
```

Missing reference link—reviewers and developers won't know where the rule comes from.

```
This violates Guideline: Naming Conventions
Reference: https://registry.joyco.studio/toolbox/pr-guidelines#naming

Variable names should use camelCase, not snake_case.
```

Generated/guessed URL—the actual frontmatter says `#naming-conventions`, not `#naming`. Always use the exact value from frontmatter.

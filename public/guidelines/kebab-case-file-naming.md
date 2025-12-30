---
reference: https://registry.joyco.studio/toolbox/pr-guidelines#kebab-case-file-naming
---

# Kebab-Case File Naming

### What

Use lowercase kebab-case (`my-component.tsx`) instead of PascalCase (`MyComponent.tsx`) for file and folder names.

### Why

File systems differ in case sensitivity—Linux/macOS are case-sensitive while Windows is case-insensitive. Mixing PascalCase can lead to confusing Git renames, mistaken file references, or broken imports when collaborating across different operating systems. Using all-lowercase kebab-case avoids these cross-platform issues entirely.

### Good

```
components/
  button.tsx
  card-link.tsx
  file-dropzone.tsx
  mobile-menu.tsx
hooks/
  use-config.ts
  use-file-upload.tsx
lib/
  compose-refs.ts
  external-registries.ts
```

### Bad

```
components/
  Button.tsx
  CardLink.tsx
  FileDropzone.tsx
  MobileMenu.tsx
hooks/
  UseConfig.ts
  useFileUpload.tsx
lib/
  ComposeRefs.ts
  ExternalRegistries.ts
```

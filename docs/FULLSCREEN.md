# Fullscreen Architecture

## Default strategy: overlay

`DataTable.Fullscreen` defaults to `strategy="overlay"`.

The component renders its active surface through a React portal into `document.body`:

```text
DataTable.Root
  |
  +-- Fullscreen (normal DOM position)
        |
        +-- Toolbar / Table / Footer

when active

body
  |
  +-- Fullscreen overlay
        |
        +-- Toolbar / Table / Footer
```

The React portal does not lose React context. `useDataTable()` continues to resolve the same TanStack Table instance. Only the DOM placement changes.

This is deliberate: application shells frequently contain `overflow`, `transform`, stacking contexts, dark backgrounds, or constrained max-width containers. A body-level portal removes those constraints from the fullscreen workspace.

## Native strategy

Consumers can opt into:

```tsx
<DataTable.Fullscreen strategy="native">
  ...
</DataTable.Fullscreen>
```

The native Fullscreen API is attempted first. If it is unavailable or rejected, the component falls back to the overlay implementation.

The native surface explicitly defines:

- `width: 100vw` / `100dvw`
- `height: 100vh` / `100dvh`
- `background: #fff`
- `::backdrop`
- contained scrolling

## State ownership

Fullscreen owns only presentation state:

```text
isFullscreen
strategy
trigger reference
```

The table continues to own:

```text
sorting
filtering
pagination
selection
visibility
pinning
expansion
```

No data or table state is copied when entering fullscreen.

## Accessibility

- Fullscreen control uses `aria-pressed`.
- Escape exits overlay fullscreen.
- Focus returns to the triggering control after exit.
- The table remains keyboard navigable inside the fullscreen surface.
- Body scrolling is disabled while the overlay is active.

## Why overlay is the default

A component library should optimize for deterministic behavior across embedding environments. The overlay strategy does not depend on browser-specific fullscreen backdrop rendering and avoids inherited CSS from application shells. Native fullscreen remains available for products that explicitly need browser fullscreen semantics.

## Reference app styling note

The reference app imports the library stylesheet explicitly from `src/main.tsx`. The demo intentionally imports internal component modules instead of the published package entry, so relying on `src/index.ts` to import `data-table.css` would leave library-only styles unavailable to the local demo. This is especially important for the body-level fullscreen portal.

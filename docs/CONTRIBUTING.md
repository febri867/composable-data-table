# Contributing

## Development

```bash
npm install
npm run dev
npm run docs
npm run storybook
```

The production-facing playground is `/docs`.

## Before opening a PR

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run build-storybook
```

## Component changes

When adding a table feature:

1. Ask whether it belongs in the reusable table system or the consuming product.
2. Prefer a small compound primitive over another root boolean prop.
3. Keep TanStack state and feature APIs in the root.
4. Preserve controlled/manual operation where practical.
5. Add an interactive example to `/docs` for reviewer discoverability.
6. Add or update Storybook coverage.
7. Add behavioral tests for the user-visible outcome.
8. Update `docs/API.md` when the public API changes.

## Tests

Tests should interact with the rendered UI using accessible queries. Avoid testing internal TanStack implementation details unless the behavior cannot be expressed otherwise.

## Accessibility

New controls must:

- have an accessible name
- be keyboard reachable
- expose state with ARIA only when native semantics are insufficient
- preserve focus-visible styling
- avoid click-only interactions

## API stability

Avoid breaking the compound component surface unless the benefit is substantial. Prefer additive APIs and deprecations where possible.

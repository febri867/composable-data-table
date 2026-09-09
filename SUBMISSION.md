# Coconut Lab Submission

## Overview

This project is a composable React data table built with TypeScript and TanStack Table.

The main focus is to keep the table reusable and easy to extend without turning the API into a single large component with a growing number of configuration props.

The implementation covers:

- composable table primitives
- controlled and uncontrolled state
- client-side and server-side workflows
- sorting and filtering
- pagination and infinite scroll
- row selection and column visibility
- column pinning and ordering
- expandable rows and grouping
- fullscreen mode
- loading and empty states
- accessibility and keyboard interactions
- behavioral tests
- Storybook and interactive documentation

## Review Path

For a quick review, I recommend:

1. Open `/docs` to explore the table interactively.
2. Review `src/components/data-table/` for the component structure.
3. Start with `src/components/data-table/core/root.tsx` to see how the table instance and state are configured.
4. Review `src/components/data-table/core/context.tsx` to see how child components share the table instance.
5. Review `docs/API.md` for the public component API.
6. Review `docs/ARCHITECTURE.md` for the implementation approach and state ownership.
7. Review `src/test/data-table.test.tsx` for behavioral tests.
8. Run `npm run ci` to run the project's main checks.

## Composition

The table is designed around a shared TanStack Table instance.

Instead of exposing a large component API such as:

```tsx
<DataTable
  searchable
  sortable
  filterable
  pagination
  selectable
  ...
/>
```

the functionality is composed from smaller primitives:

```tsx
<DataTable.Root data={data} columns={columns} enableRowSelection>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />

      <DataTable.Actions>
        <DataTable.FacetedFilter columnId="status" />
        <DataTable.ViewOptions />
      </DataTable.Actions>
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table stickyHeader />

  <DataTable.Footer>
    <DataTable.Pagination />
  </DataTable.Footer>
</DataTable.Root>
```

This keeps individual features optional and allows consumers to add their own controls when the built-in primitives are not enough.

Custom controls can also use `useDataTable()` to access the same table instance.

## State Ownership

The table supports both uncontrolled and controlled state.

For simple use cases, the table can manage its own state:

```tsx
<DataTable.Root
  data={data}
  columns={columns}
>
  ...
</DataTable.Root>
```

When the application needs to synchronize table state with an API, URL, or another state manager, individual state slices can be controlled:

```tsx
<DataTable.Root
  data={rows}
  columns={columns}
  state={{
    sorting,
    columnFilters,
    pagination,
  }}
  onSortingChange={setSorting}
  onColumnFiltersChange={setColumnFilters}
  onPaginationChange={setPagination}
  manualSorting
  manualFiltering
  manualPagination
  rowCount={total}
>
  ...
</DataTable.Root>
```

Partial control is supported, so consumers do not need to manage every table state slice.

## Main Design Decisions

### Composition over configuration

The table is split into smaller components instead of exposing every feature through the root component.

This keeps the API easier to understand and makes it possible to add or replace individual controls without changing the table core.

### TanStack Table for table behavior

TanStack Table is used for table state and row-model logic.

The component layer focuses on rendering, interaction, accessibility, and providing reusable UI primitives around the table instance.

### Application-owned data fetching

The table does not make assumptions about networking or caching.

For server-side pagination, filtering, or sorting, the consuming application owns the request and provides the resulting data and state to the table.

### Separate library and example code

Reusable components are kept under:

```text
src/components/data-table/
```

while the demo and documentation are kept separately.

This prevents example-specific behavior from becoming part of the reusable table API.

## Filtering and Pagination

Client-side filtering and pagination are handled through the TanStack row models.

An important interaction detail is keeping pagination consistent when the result set changes.

When a search or column filter reduces the number of rows, the uncontrolled table returns to the first page rather than leaving the user on a page that no longer contains results.

Pagination also stays within the available range when the underlying data changes.

This behavior is covered by the test suite and can be explored from the `/docs` playground.

## Fullscreen

Fullscreen is implemented as a separate primitive around the table rather than being part of the table core.

```tsx
<DataTable.Root data={data} columns={columns}>
  <DataTable.Fullscreen>
    <DataTable.Header>
      <DataTable.Toolbar>
        <DataTable.Search />
        <DataTable.FullscreenButton />
      </DataTable.Toolbar>
    </DataTable.Header>

    <DataTable.Table stickyHeader />

    <DataTable.Footer>
      <DataTable.Pagination />
    </DataTable.Footer>
  </DataTable.Fullscreen>
</DataTable.Root>
```

The default overlay strategy uses a body-level portal so the fullscreen workspace is not affected by parent layout constraints.

A native browser Fullscreen API strategy is also available:

```tsx
<DataTable.Fullscreen strategy="native">
  ...
</DataTable.Fullscreen>
```

The fullscreen workspace continues to use the same table instance and state.

## Testing

The project uses Vitest and Testing Library.

Tests focus on user-visible behavior rather than implementation details.

The current test suite covers:

- initial rendering and pagination
- pagination navigation
- global search
- column filtering
- faceted filtering
- sorting
- row selection
- column visibility
- fullscreen interaction
- focus restoration

Run the tests with:

```bash
npm test
```

## Quality Checks

The main project checks are:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run build-storybook
```

They can also be run together with:

```bash
npm run ci
```

## Project Structure

The reusable table components are organized by responsibility:

```text
src/components/data-table/
├── core/
│   ├── context.tsx
│   ├── root.tsx
│   └── index.ts
│
├── controls/
│   ├── search.tsx
│   ├── column-filters.tsx
│   ├── sort-button.tsx
│   ├── menu-button.tsx
│   ├── column-visibility.tsx
│   ├── table-options.tsx
│   └── index.ts
│
├── display/
│   ├── layout.tsx
│   ├── table.tsx
│   └── index.ts
│
├── navigation/
│   ├── pagination.tsx
│   └── index.ts
│
├── utilities/
│   ├── selection.tsx
│   ├── export-csv.tsx
│   ├── density.tsx
│   ├── infinite-scroll.tsx
│   ├── column-pinning.tsx
│   ├── row-count.tsx
│   └── index.ts
│
├── fullscreen/
│   ├── fullscreen.tsx
│   └── index.ts
│
├── hooks/
│   ├── menu-hooks.ts
│   └── index.ts
│
└── index.ts
```

The separation is mainly intended to keep the table core small and make individual features easier to maintain.

## Documentation

The repository uses different documents for different purposes:

| File | Purpose |
| --- | --- |
| `README.md` | Project overview, setup, features, and basic usage |
| `SUBMISSION.md` | Reviewer path and main design decisions |
| `CHANGELOG.md` | Release and change history |
| `docs/API.md` | Public component API |
| `docs/ARCHITECTURE.md` | Architecture and state ownership |
| `docs/CONTRIBUTING.md` | Development workflow |
| `docs/PUBLISHING.md` | Package build and publishing |

The `/docs` application provides an interactive way to explore the components, while Storybook provides isolated component examples.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Documentation:

```text
http://localhost:5173/docs
```

Storybook:

```bash
npm run storybook
```

## Package

The reusable library can be built separately from the demo application:

```bash
npm run build:package
```

The package exposes the `DataTable` components and stylesheet.

Example:

```tsx
import 'coconut-composable-data-table/styles.css'
import { DataTable } from 'coconut-composable-data-table'
```

## Reference

The implementation uses the TanStack Table v8 API.

The initial table implementation follows the concepts demonstrated in the TanStack Table Basic Table example:

https://tanstack.com/table/latest/docs/framework/react/examples/basic-use-table

## Final Notes

The project is intentionally structured as both a reusable component library and a reference application.

The demo and documentation use local fixture data so the table interactions can be explored without requiring an external API.

When reviewing the implementation, the areas I would focus on are:

- component composition
- state ownership
- controlled and uncontrolled behavior
- separation between reusable and example code
- accessibility and interaction handling
- test coverage
- how easily additional table features can be composed without changing the core API

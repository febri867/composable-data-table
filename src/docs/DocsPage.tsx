import {
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  Github,
  Play,
} from 'lucide-react'
import { PlaygroundExample } from '@/examples/PlaygroundExample'
import { CodeBlock } from './CodeBlock'
import { DocsNav } from './DocsNav'
import { apiExamples } from './api-examples'

export function DocsPage() {
  return (
    <div className="docs-page">
      <header className="docs-topbar">
        <a className="docs-brand" href="/">
          <span className="brand-mark">C</span> Coconut Components{' '}
          <span className="docs-version">v0.1.9</span>
        </a>
        <nav>
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href="#architecture">Architecture</a>
          <a href="/" aria-label="Open reference demo">
            <ExternalLink size={15} /> Demo
          </a>
        </nav>
      </header>
      <div className="docs-layout">
        <DocsNav />
        <main className="docs-content">
          <section id="overview" className="docs-hero">
            <div className="docs-badge">
              <Code2 size={14} /> React + TypeScript component library
            </div>
            <h1>Composable Data Table</h1>
            <p>
              A production-oriented table system built on TanStack Table. The
              package owns reusable primitives and table state wiring; examples
              own product UI, data, networking simulations, and row actions.
            </p>
            <div className="docs-actions">
              <a className="docs-primary" href="#playground">
                Open playground <Play size={15} />
              </a>
              <a className="docs-secondary" href="#api">
                Read the API
              </a>
              <a className="docs-secondary" href="/">
                Reference demo
              </a>
            </div>
            <div className="docs-callout">
              <CheckCircle2 size={18} />
              <div>
                <strong>
                  Library and examples are intentionally separated
                </strong>
                <p>
                  <code>src/components/data-table</code> is the package
                  boundary. <code>src/examples</code> is never exported from the
                  library entry point and exists only to demonstrate real
                  product usage.
                </p>
              </div>
            </div>
          </section>

          <section id="installation" className="docs-section">
            <span className="docs-kicker">GET STARTED</span>
            <h2>Installation</h2>
            <p>
              Install the package and its peer table engine. The package keeps
              React and TanStack Table as peer dependencies so applications
              retain control over versions and bundling.
            </p>
            <CodeBlock>{`npm install coconut-composable-data-table @tanstack/react-table

import 'coconut-composable-data-table/styles.css'
import { DataTable } from 'coconut-composable-data-table'`}</CodeBlock>
            <h3>Minimal table</h3>
            <CodeBlock>{`import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'coconut-composable-data-table'

type User = { id: string; name: string; role: string }
const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('role', { header: 'Role' }),
]

export function Users() {
  return (
    <DataTable.Root data={users} columns={columns}>
      <DataTable.Table />
    </DataTable.Root>
  )
}`}</CodeBlock>
          </section>

          <section id="composition" className="docs-section">
            <span className="docs-kicker">COMPOSITION</span>
            <h2>Build the table from primitives</h2>
            <p>
              The root creates one TanStack table instance. Descendants consume
              that instance through context. You can remove, reorder, replace,
              or extend UI without creating a growing monolithic prop API.
            </p>
            <CodeBlock>{`<DataTable.Root data={data} columns={columns} enableRowSelection>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />
      <DataTable.Actions>
        <DataTable.FacetedFilter columnId="status" />
        <DataTable.ColumnFilter columnId="name" />
        <DataTable.ViewOptions />
      </DataTable.Actions>
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table stickyHeader />

  <DataTable.Footer>
    <DataTable.Pagination />
  </DataTable.Footer>
</DataTable.Root>`}</CodeBlock>
            <div className="docs-callout">
              <BookOpen size={18} />
              <div>
                <strong>Extension point</strong>
                <p>
                  Use <code>useDataTable&lt;TData&gt;()</code> when
                  application-specific controls need the table instance without
                  adding product concerns to the package.
                </p>
              </div>
            </div>
          </section>

          <section id="playground" className="docs-section">
            <div className="docs-section-heading">
              <div>
                <span className="docs-kicker">PLAYGROUND</span>
                <h2>Try every interaction</h2>
                <p>
                  The playground uses stable local dummy data so filtering,
                  searching, sorting, selection, visibility, export, pagination
                  and infinite loading can all be exercised without an API.
                </p>
              </div>
              <div className="docs-inline-code">
                DataTable.Root&lt;PlaygroundUser&gt;
              </div>
            </div>
            <PlaygroundExample />
          </section>

          <section id="features" className="docs-section">
            <span className="docs-kicker">FEATURES</span>
            <h2>What the library provides</h2>
            <div className="feature-grid">
              {[
                'Sorting & multi-sort',
                'Global & column filtering',
                'Header column-filter actions',
                'Faceted filters',
                'Filter rows',
                'Row selection & bulk actions',
                'Column visibility',
                'Column pinning',
                'Column resizing',
                'Column ordering state',
                'Grouping & expansion',
                'Loading & empty states',
                'CSV export primitive',
                'Responsive native table',
                'Controlled/server-side state',
                'Pagination',
                'Infinite scroll',
              ].map((item) => (
                <article className="feature-card" key={item}>
                  <span className="feature-check">✓</span>
                  <span>{item}</span>
                </article>
              ))}
            </div>
            <p className="docs-note">
              The library deliberately does not own fetching, caching, routing,
              URL state, virtualization, or business-specific actions. Those are
              application concerns and can be composed around the same table
              instance.
            </p>
          </section>

          <section id="pagination" className="docs-section">
            <span className="docs-kicker">PAGINATION</span>
            <h2>Client or server pagination</h2>
            <p>
              Client pagination is enabled by default. For API-backed tables,
              use controlled pagination plus <code>manualPagination</code> and
              provide the total row count.
            </p>
            <CodeBlock>{`const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 25,
})

<DataTable.Root
  data={query.data?.rows ?? []}
  columns={columns}
  state={{ pagination }}
  onPaginationChange={setPagination}
  manualPagination
  rowCount={query.data?.total ?? 0}
>
  <DataTable.Table loading={query.isFetching} />
  <DataTable.Pagination pageSizeOptions={[25, 50, 100]} />
</DataTable.Root>`}</CodeBlock>
          </section>

          <section id="infinite-scroll" className="docs-section">
            <span className="docs-kicker">INFINITE SCROLL</span>
            <h2>Progressive loading</h2>
            <p>
              <code>DataTable.InfiniteScroll</code> is transport-agnostic. Your
              query/cache layer appends rows; the component observes a sentinel
              and requests the next page.
            </p>
            <CodeBlock>{`const [rows, setRows] = useState(firstPage.rows)

const loadMore = async () => {
  const next = await fetchNextPage()
  setRows((current) => [...current, ...next.rows])
}

<DataTable.Root data={rows} columns={columns}>
  <DataTable.Table />
  <DataTable.InfiniteScroll
    hasMore={hasNextPage}
    loading={isFetchingNextPage}
    onLoadMore={loadMore}
  />
</DataTable.Root>`}</CodeBlock>
          </section>

          <section id="server-side" className="docs-section">
            <span className="docs-kicker">SERVER-SIDE</span>
            <h2>Controlled state</h2>
            <p>
              Lift sorting, filters, pagination, selection, expansion, grouping,
              pinning, or column order into your application when the URL, API,
              cache, or global store needs to own them.
            </p>
            <CodeBlock>{`<DataTable.Root
  data={query.data?.rows ?? []}
  columns={columns}
  state={{ sorting, columnFilters, pagination }}
  onSortingChange={setSorting}
  onColumnFiltersChange={setColumnFilters}
  onPaginationChange={setPagination}
  manualSorting
  manualFiltering
  manualPagination
  rowCount={query.data?.total ?? 0}
>
  <DataTable.Table loading={query.isFetching} />
  <DataTable.Pagination />
</DataTable.Root>`}</CodeBlock>
          </section>

          <section id="api" className="docs-section">
            <span className="docs-kicker">API REFERENCE</span>
            <h2>Public component surface</h2>
            <p>
              The public entry point intentionally exports only the table
              package surface. Example screens and fixture data are not part of
              the published API.
            </p>
            <div className="api-table">
              {[
                [
                  'Root',
                  'Creates the table instance and provides shared state/options to descendants.',
                ],
                [
                  'Header / Toolbar / Actions / Footer',
                  'Structural composition slots.',
                ],
                [
                  'Table',
                  'Semantic table renderer with loading, empty, caption, sticky, striped, density, resizing, pinning, and expanded-row support.',
                ],
                [
                  'Search',
                  'Global or column search with debounce, clear action, and automatic page reset.',
                ],
                [
                  'Filter / ColumnFilter / FilterRow / FacetedFilter / ClearFilters',
                  'Inline, popover, filter-row, and faceted filtering primitives.',
                ],
                [
                  'Pagination',
                  'Page navigation, page size, counts, first/last controls, and automatic bounds correction.',
                ],
                [
                  'InfiniteScroll',
                  'IntersectionObserver sentinel for incremental loading.',
                ],
                [
                  'SelectionHeader / SelectionCell / BulkActions',
                  'Accessible row selection and selection-aware UI.',
                ],
                ['SortButton', 'Explicit sortable header control.'],
                [
                  'ViewOptions / ColumnVisibility',
                  'Column visibility controls.',
                ],
                [
                  'Pinning / ResizeHandle',
                  'Column pinning and resize interactions.',
                ],
                ['ExpandButton', 'Expandable-row trigger.'],
                ['ExportCsv', 'Small client-side CSV export primitive.'],
                [
                  'Reset / TableOptions / Density',
                  'Common table state and presentation controls.',
                ],
                [
                  'useDataTable',
                  'Escape hatch for custom controls that need the shared table instance.',
                ],
              ].map(([name, description]) => (
                <div className="api-row" key={name}>
                  <code>DataTable.{name}</code>
                  <span>{description}</span>
                </div>
              ))}
            </div>
            <h3>Key signatures</h3>
            <div className="api-table">
              {[
                [
                  'Root',
                  'data: TData[] · columns: ColumnDef<TData>[] · state?: Partial<TableState> · initialState?: { pagination?: Partial<PaginationState> } · on*Change?: handlers · manualPagination?: boolean · manualSorting?: boolean · manualFiltering?: boolean · rowCount?: number',
                ],
                [
                  'Table',
                  'loading?: boolean · loadingRows?: number · empty?: ReactNode · stickyHeader?: boolean · striped?: boolean · density?: compact | default | comfortable',
                ],
                [
                  'Search',
                  'columnId?: string · debounceMs?: number · placeholder?: string · value?: string',
                ],
                [
                  'ColumnFilter',
                  'columnId: string · label?: string · placeholder?: string · className?: string',
                ],
                [
                  'Pagination',
                  'pageSizeOptions?: number[] · showPageSize?: boolean · showPageNumbers?: boolean · siblingCount?: number',
                ],
                [
                  'InfiniteScroll',
                  'hasMore: boolean · loading?: boolean · onLoadMore: () => void | Promise<void> · rootMargin?: string · threshold?: number',
                ],
              ].map(([name, signature]) => (
                <div className="api-row" key={name}>
                  <code>DataTable.{name}</code>
                  <span>{signature}</span>
                </div>
              ))}
            </div>
            <div className="docs-callout">
              <CheckCircle2 size={18} />
              <div>
                <strong>Type-safe state contracts</strong>
                <p>
                  <code>initialState.pagination</code> accepts partial values
                  such as <code>{`{ pageSize: 25 }`}</code> and the library
                  normalizes the missing <code>pageIndex</code>. Row predicates
                  passed to <code>enableExpanding</code> are normalized to
                  TanStack&apos;s boolean option plus{' '}
                  <code>getRowCanExpand</code>.
                </p>
              </div>
            </div>
            <h3>Usage examples</h3>
            <p>
              Each primitive is designed to be composed. You can use the
              complete reference setup or pick only the pieces your product
              needs.
            </p>
            <CodeBlock>{`import { DataTable } from 'coconut-composable-data-table'
import type { ColumnDef } from '@tanstack/react-table'
import 'coconut-composable-data-table/styles.css'

type User = { id: string; name: string; status: 'Active' | 'Paused'; score: number }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status', filterFn: 'equalsString' },
  { accessorKey: 'score', header: 'Score', filterFn: 'inNumberRange' },
]

<DataTable.Root data={users} columns={columns} enableRowSelection>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search placeholder="Search users…" />
      <DataTable.Actions>
        <DataTable.FacetedFilter columnId="status" />
        <DataTable.ClearFilters />
        <DataTable.ViewOptions />
      </DataTable.Actions>
    </DataTable.Toolbar>
    <DataTable.FilterRow />
  </DataTable.Header>

  <DataTable.Table striped stickyHeader />
  <DataTable.Footer>
    <DataTable.Pagination pageSizeOptions={[10, 25, 50]} />
  </DataTable.Footer>
</DataTable.Root>`}</CodeBlock>
            <CodeBlock>{`// Custom controls can access the same table instance.
function MyToolbarAction() {
  const { table } = useDataTable<User>()
  const selected = table.getSelectedRowModel().rows

  return (
    <button disabled={!selected.length} onClick={() => exportRows(selected)}>
      Export selected
    </button>
  )
}`}</CodeBlock>
            <div className="docs-callout">
              <Code2 size={18} />
              <div>
                <strong>Generated API docs</strong>
                <p>
                  Run <code>npm run docs:api</code> to generate TypeDoc from the
                  public TSDoc annotations. The generated site is based on the
                  same public entry point consumers import from.
                </p>
              </div>
            </div>
            <h3>Primitive-by-primitive examples</h3>
            <div className="api-example-grid">
              {apiExamples.map(([name, example]) => (
                <article className="api-example" key={name}>
                  <div className="api-example-heading">
                    <code>DataTable.{name}</code>
                  </div>
                  <CodeBlock>{example}</CodeBlock>
                </article>
              ))}
            </div>
          </section>

          <section id="architecture" className="docs-section">
            <span className="docs-kicker">ARCHITECTURE</span>
            <h2>Package boundaries</h2>
            <p>
              The repository is split into library code, reference examples,
              documentation, and tooling. Only the library entry point is
              published.
            </p>
            <CodeBlock>{`src/
├── components/data-table/     # public reusable library
│   ├── context.tsx
│   ├── root.tsx
│   ├── fullscreen.tsx
│   ├── layout.tsx
│   ├── menus.tsx
│   ├── filters.tsx
│   ├── table.tsx
│   ├── pagination.tsx
│   ├── utilities.tsx
│   ├── core/
│   ├── context.tsx
│   └── root.tsx
│   └── index.ts
├── index.ts                   # package boundary
├── examples/                  # demo-only; never exported
│   ├── data.ts
│   ├── ProjectTableExample.tsx
│   └── PlaygroundExample.tsx
├── demo/                      # / home reference implementation
├── docs/                      # /docs playground + guides
└── styles/                    # package + app styles

Package boundary:
  application -> DataTable primitives -> TanStack Table
  application -> examples (reference only)

The package never depends on the demo or documentation layer.`}</CodeBlock>
            <div className="docs-callout">
              <CheckCircle2 size={18} />
              <div>
                <strong>Why this matters</strong>
                <p>
                  A reviewer can remove <code>src/demo</code>,{' '}
                  <code>src/examples</code>, and <code>src/docs</code> and the
                  published library still has a complete, isolated API surface.
                </p>
              </div>
            </div>
          </section>

          <section id="reference" className="docs-section">
            <span className="docs-kicker">REFERENCE</span>
            <h2>TanStack Table alignment</h2>
            <p>
              The implementation follows the headless workflow shown by
              TanStack: define stable data and columns, create one table
              instance, and render rows/cells through the table APIs. TanStack's
              current examples also separate sorting, filters, pagination,
              selection, pinning, sizing and infinite scrolling, which maps
              cleanly to the composable primitives here.
            </p>
            <div className="docs-callout">
              <ExternalLink size={18} />
              <div>
                <strong>Implementation reference</strong>
                <p>
                  <a
                    href="https://tanstack.com/table/latest/docs/framework/react/examples/basic-use-table"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TanStack Table · Basic Use Table
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section id="accessibility" className="docs-section">
            <span className="docs-kicker">ACCESSIBILITY</span>
            <h2>Accessible by construction</h2>
            <ul className="docs-list">
              <li>
                Native <code>table</code>, <code>thead</code>,{' '}
                <code>tbody</code>, <code>th</code>, and <code>td</code>{' '}
                semantics.
              </li>
              <li>
                Interactive controls use real buttons, inputs, labels and select
                elements.
              </li>
              <li>
                Sorting exposes <code>aria-sort</code>.
              </li>
              <li>
                Selection controls expose row-specific labels and indeterminate
                header state.
              </li>
              <li>Scrollable table regions are keyboard focusable.</li>
              <li>
                Loading and infinite-scroll state is exposed through
                status/live-region semantics.
              </li>
            </ul>
          </section>

          <section id="troubleshooting" className="docs-section">
            <span className="docs-kicker">TROUBLESHOOTING</span>
            <h2>Common integration failures</h2>
            <p>
              The table is intentionally defensive, but consumers should keep
              React and TanStack Table versions aligned and avoid duplicating
              the TanStack package in a monorepo.
            </p>
            <CodeBlock>{`// Check the resolved versions in your application
npm ls react react-dom @tanstack/react-table

// The library requires TanStack Table 8.x
// and React 18.2+ / 19.x.

// If a bundler reports a missing column sizing method,
// make sure only one TanStack Table installation is resolved.`}</CodeBlock>
            <div className="docs-callout">
              <CheckCircle2 size={18} />
              <div>
                <strong>Browser extension noise</strong>
                <p>
                  Messages such as <code>Could not establish connection</code>{' '}
                  or MetaMask connection errors can originate from browser
                  extensions. They are unrelated to the library unless the stack
                  trace points into the application source.
                </p>
              </div>
            </div>
          </section>

          <section id="testing" className="docs-section docs-last">
            <span className="docs-kicker">QUALITY</span>
            <h2>Testing and engineering workflow</h2>
            <p>
              Behavioral tests should verify user outcomes rather than
              implementation details. The repository includes Vitest + Testing
              Library, linting, type checking, Storybook, TypeDoc and CI.
            </p>
            <CodeBlock>{`npm run typecheck
npm run lint
npm test
npm run build
npm run build:package
npm run docs:api
npm run build-storybook`}</CodeBlock>
            <div className="docs-callout">
              <Github size={18} />
              <div>
                <strong>Storybook vs /docs</strong>
                <p>
                  <code>/docs</code> is the production-facing reference and
                  playground. Storybook remains a maintainer tool for isolated
                  component states and visual regression work.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

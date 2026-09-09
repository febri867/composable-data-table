import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'

interface Person {
  id: string
  name: string
  city: string
  status: 'Active' | 'Invited'
}
const helper = createColumnHelper<Person>()
const columns: ColumnDef<Person, any>[] = [
  helper.accessor('name', {
    header: () => <DataTable.SortButton columnId="name" label="Name" />,
    filterFn: 'includesString',
  }),
  helper.accessor('city', {
    header: () => <DataTable.SortButton columnId="city" label="City" />,
    filterFn: 'includesString',
  }),
  helper.accessor('status', {
    header: () => <DataTable.SortButton columnId="status" label="Status" />,
    filterFn: 'arrIncludesSome',
  }),
]
const data: Person[] = [
  { id: '1', name: 'Aisha', city: 'Bangalore', status: 'Active' },
  { id: '2', name: 'Balaji', city: 'Vancouver', status: 'Invited' },
  { id: '3', name: 'Meera', city: 'Toronto', status: 'Active' },
  { id: '4', name: 'Sofia', city: 'Jakarta', status: 'Invited' },
]

function renderTable() {
  return render(
    <DataTable.Root<Person>
      data={data}
      columns={columns}
      initialState={{ pagination: { pageIndex: 0, pageSize: 2 } }}
      enableRowSelection
    >
      <DataTable.Toolbar>
        <DataTable.Search placeholder="Search…" />
        <DataTable.ColumnFilter columnId="city" />
        <DataTable.FacetedFilter columnId="status" label="Status" />
        <DataTable.ViewOptions />
      </DataTable.Toolbar>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Root>,
  )
}

describe('DataTable', () => {
  it('renders the first page and navigates pagination', async () => {
    const user = userEvent.setup()
    renderTable()
    expect(screen.getByText('Aisha')).toBeInTheDocument()
    expect(screen.getByText('Balaji')).toBeInTheDocument()
    expect(screen.queryByText('Meera')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(await screen.findByText('Meera')).toBeInTheDocument()
    expect(screen.getByText('Sofia')).toBeInTheDocument()
    expect(screen.queryByText('Aisha')).not.toBeInTheDocument()
  })

  it('filters through global search and resets to the first page', async () => {
    const user = userEvent.setup()
    renderTable()
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await user.type(screen.getByPlaceholderText('Search…'), 'Aisha')
    expect(await screen.findByText('Aisha')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText(/1–1 of 1/)).toBeInTheDocument(),
    )
  })

  it('supports a header column-filter action', async () => {
    const user = userEvent.setup()
    renderTable()
    const filterButton = screen.getByRole('button', { name: /Filter City/i })
    await user.click(filterButton)
    const dialog = screen.getByRole('dialog', { name: /Filter City/i })
    await user.type(
      within(dialog).getByPlaceholderText('Filter values…'),
      'Toronto',
    )
    expect(await screen.findByText('Meera')).toBeInTheDocument()
    expect(screen.queryByText('Aisha')).not.toBeInTheDocument()
  })

  it('supports faceted filtering', async () => {
    const user = userEvent.setup()
    renderTable()
    await user.click(screen.getByRole('button', { name: /^Status/ }))
    const menu = screen.getByRole('menu', { name: /Status filter/i })
    await user.click(within(menu).getByRole('button', { name: 'Active' }))
    expect(await screen.findByText('Aisha')).toBeInTheDocument()
    expect(screen.queryByText('Balaji')).not.toBeInTheDocument()
  })

  it('supports sorting', async () => {
    const user = userEvent.setup()
    renderTable()
    await user.click(screen.getByRole('button', { name: 'Sort by Name' }))
    const rows = screen.getAllByRole('row').slice(1)
    expect(within(rows[0]).getByText('Aisha')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sort by Name' }))
    const descendingRows = screen.getAllByRole('row').slice(1)
    expect(
      await within(descendingRows[0]).findByText('Sofia'),
    ).toBeInTheDocument()
  })

  it('supports row selection through the selection primitives', async () => {
    const user = userEvent.setup()
    render(
      <DataTable.Root<Person>
        data={data}
        columns={[
          helper.display({
            id: 'select',
            header: () => <DataTable.SelectionHeader />,
            cell: ({ row }) => <DataTable.SelectionCell row={row} />,
          }),
          ...columns,
        ]}
        enableRowSelection
      >
        <DataTable.Table />
      </DataTable.Root>,
    )
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])
    expect(screen.getByText('Aisha').closest('tr')).toHaveAttribute(
      'data-state',
      'selected',
    )
  })

  it('can toggle column visibility', async () => {
    const user = userEvent.setup()
    renderTable()
    await user.click(screen.getByRole('button', { name: /columns|view/i }))
    const menu = screen.getByRole('menu')
    await user.click(within(menu).getByRole('checkbox', { name: 'City' }))
    expect(
      screen.queryByRole('columnheader', { name: /City/i }),
    ).not.toBeInTheDocument()
  })

  it('uses a body-level overlay for deterministic fullscreen behavior', async () => {
    const user = userEvent.setup()
    render(
      <DataTable.Root<Person> data={data} columns={columns}>
        <DataTable.Fullscreen>
          <DataTable.Toolbar>
            <DataTable.FullscreenButton />
          </DataTable.Toolbar>
          <DataTable.Table />
        </DataTable.Fullscreen>
      </DataTable.Root>,
    )

    const button = screen.getByRole('button', { name: 'Full screen' })
    await user.click(button)

    const surface = document.body.querySelector('[data-fullscreen="true"]')
    expect(surface).toBeInTheDocument()
    expect(surface).toHaveClass('is-overlay-fullscreen')
    expect(surface?.parentElement).toHaveClass('dt-fullscreen-portal')
    expect(
      screen.getByRole('button', { name: 'Exit full screen' }),
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(
        document.body.querySelector('[data-fullscreen="true"]'),
      ).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Full screen' })).toHaveFocus()
  })
})

it('accepts partial initial pagination and normalizes the page index', () => {
  render(
    <DataTable.Root<Person>
      data={data}
      columns={columns}
      initialState={{ pagination: { pageSize: 2 } }}
    >
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Root>,
  )

  expect(screen.getByText(/1–2 of 4/)).toBeInTheDocument()
})

it('supports a row predicate through enableExpanding', () => {
  const expandableColumns: ColumnDef<Person, any>[] = [
    helper.display({
      id: 'expand',
      header: 'Expand',
      cell: ({ row }) => <DataTable.ExpandButton row={row} />,
      meta: { renderExpanded: () => <div>Expanded details</div> },
    }),
    ...columns,
  ]

  render(
    <DataTable.Root<Person>
      data={data}
      columns={expandableColumns}
      enableExpanding={(row) => row.original.status === 'Active'}
    >
      <DataTable.Table />
    </DataTable.Root>,
  )

  expect(
    screen.getAllByRole('button', { name: 'Toggle row details' }),
  ).toHaveLength(2)
})

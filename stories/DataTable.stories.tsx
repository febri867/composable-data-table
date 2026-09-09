import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'

type Payment = { id: string; customer: string; status: 'Paid' | 'Pending' | 'Failed'; amount: number; team: string }
const helper = createColumnHelper<Payment>()
const data: Payment[] = Array.from({ length: 36 }, (_, index) => ({
  id: `INV-${1042 - index}`,
  customer: ['Acme Inc.', 'Northstar', 'Globex', 'Umbrella', 'Wayfinder'][index % 5],
  status: (['Paid', 'Pending', 'Failed'] as const)[index % 3],
  amount: 420 + index * 137,
  team: ['Platform', 'Growth', 'Product'][index % 3],
}))
const columns: ColumnDef<Payment, any>[] = [
  helper.accessor('id', { header: 'Invoice' }),
  helper.accessor('customer', { header: () => <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DataTable.SortButton columnId="customer" label="Customer" /><DataTable.ColumnFilter columnId="customer" /></div>, filterFn: 'includesString' }),
  helper.accessor('status', { header: 'Status' }),
  helper.accessor('team', { header: 'Team' }),
  helper.accessor('amount', { header: 'Amount', cell: ({ getValue }) => `$${getValue().toLocaleString()}` }),
]

const meta = {
  title: 'Data Table/Composable API',
  component: DataTable.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Composable table primitives backed by TanStack Table. Use /docs in the application for the full interactive playground.' } },
  },
} satisfies Meta<typeof DataTable.Root>

export default meta
type Story = StoryObj<typeof meta>

const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ padding: 32, background: '#f5f6f8' }}><div style={{ maxWidth: 1100, margin: '0 auto', overflow: 'hidden', border: '1px solid #e1e4e8', borderRadius: 12, background: '#fff' }}>{children}</div></div>

export const Default: Story = {
  render: () => <Frame><DataTable.Root data={data} columns={columns} enableRowSelection initialState={{ pagination: { pageSize: 10 } }}><DataTable.Header><DataTable.Toolbar><DataTable.Search columnId="customer" placeholder="Search customers…" /><DataTable.Actions><DataTable.FacetedFilter columnId="status" /><DataTable.ViewOptions /><DataTable.Reset /></DataTable.Actions></DataTable.Toolbar><DataTable.FilterRow /><DataTable.BulkActions /></DataTable.Header><DataTable.Table striped /><DataTable.Footer><DataTable.Pagination /></DataTable.Footer></DataTable.Root></Frame>,
}

export const Empty: Story = {
  render: () => <Frame><DataTable.Root data={[]} columns={columns}><DataTable.Table empty={<><strong>No invoices</strong><br />Create an invoice to see it here.</>} /></DataTable.Root></Frame>,
}

export const Loading: Story = {
  render: () => <Frame><DataTable.Root data={data} columns={columns}><DataTable.Table loading loadingRows={8} /></DataTable.Root></Frame>,
}

export const InfiniteScroll: Story = {
  render: () => <InfiniteExample />,
}

function InfiniteExample() {
  const [count, setCount] = React.useState(10)
  const [loading, setLoading] = React.useState(false)
  const rows = data.slice(0, count)
  const loadMore = async () => {
    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setCount((value) => Math.min(value + 10, data.length))
    setLoading(false)
  }
  return <Frame><DataTable.Root data={rows} columns={columns}><DataTable.Table /><DataTable.InfiniteScroll hasMore={count < data.length} loading={loading} onLoadMore={loadMore} /></DataTable.Root></Frame>
}

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import type { Project } from './data'

const helper = createColumnHelper<Project>()
const columns: ColumnDef<Project, any>[] = [
  helper.accessor('owner', {
    header: 'Owner',
    cell: ({ getValue }) => getValue(),
    size: 220,
  }),
  helper.accessor('city', {
    header: 'City',
    cell: ({ getValue }) => getValue(),
    size: 140,
  }),
  helper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => getValue(),
    size: 130,
  }),
]
const rows: Project[] = [
  {
    id: 'state-1',
    owner: 'Coconut Example',
    role: 'Engineer',
    city: 'Jakarta',
    location: 'Remote',
    project: 'coconut.dev',
    status: 'Verified',
    members: [],
    progress: 84,
  },
]

export function ApiCoverageExample() {
  return (
    <section className="api-coverage">
      <div className="api-coverage-heading">
        <div>
          <span className="kicker">PRIMITIVE STATES</span>
          <h2>Composable states, not magic flags</h2>
          <p>
            The reference app also exercises the standalone state primitives
            shipped by the library.
          </p>
        </div>
      </div>
      <div className="api-coverage-grid">
        <article className="api-coverage-card">
          <div className="api-coverage-label">Caption + Empty</div>
          <DataTable.Root<Project> data={[]} columns={columns}>
            <DataTable.Table
              caption="Projects"
              empty={
                <DataTable.Empty>
                  Nothing to show yet. Try adding your first project.
                </DataTable.Empty>
              }
            />
          </DataTable.Root>
        </article>
        <article className="api-coverage-card">
          <div className="api-coverage-label">Loading + Table</div>
          <DataTable.Root<Project> data={rows} columns={columns}>
            <DataTable.Table caption="Projects" loading loadingRows={3} />
          </DataTable.Root>
          <DataTable.Loading label="Refreshing project data…" />
        </article>
      </div>
    </section>
  )
}

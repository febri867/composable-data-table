import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  CheckCircle2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
} from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import {
  projectData,
  type Project,
  type ProjectStatus,
  type WorkLocation,
} from './data'

type PaginationState = { pageIndex: number; pageSize: number }
type SortingState = Array<{ id: string; desc: boolean }>
type RowSelectionState = Record<string, boolean>
type VisibilityState = Record<string, boolean>
type ColumnFiltersState = Array<{ id: string; value: unknown }>

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  )
}
function DeferredAvatar({
  src,
  initials,
  label,
  className = '',
}: {
  src?: string
  initials: string
  label: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={`avatar-image-shell ${loaded && !failed ? 'is-loaded' : ''} ${className}`}
      aria-label={label}
    >
      {!failed && src ? (
        <img
          src={src}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      <span className="avatar-fallback" aria-hidden="true">
        {initials}
      </span>
    </span>
  )
}

function AvatarStack({ people }: { people: Project['members'] }) {
  return (
    <div className="avatar-stack" aria-label={`${people.length} team members`}>
      {people.slice(0, 4).map((person) => (
        <DeferredAvatar
          key={person.name}
          src={person.image}
          initials={person.initials}
          label={person.name}
          className="avatar"
        />
      ))}
      {people.length > 4 ? (
        <span className="avatar avatar-more">+{people.length - 4}</span>
      ) : null}
    </div>
  )
}

function ProjectActions({
  row,
  onEdit,
  onDelete,
  onShare,
  onDuplicate,
}: {
  row: Project
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
  onDuplicate: () => void
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const width = 184
    const height = 144
    const gutter = 10
    const preferredTop = rect.bottom + 6
    const top =
      preferredTop + height <= window.innerHeight - gutter
        ? preferredTop
        : Math.max(gutter, rect.top - height - 6)
    const left = Math.max(
      gutter,
      Math.min(window.innerWidth - width - gutter, rect.right - width),
    )

    setPosition({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    updatePosition()

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, updatePosition])

  const menu =
    open && position
      ? createPortal(
          <div
            ref={menuRef}
            className="row-action-menu row-action-menu-portal"
            role="menu"
            style={{ top: position.top, left: position.left }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDuplicate()
                setOpen(false)
              }}
            >
              Duplicate project
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onEdit()
                setOpen(false)
              }}
            >
              Edit details
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onShare()
                setOpen(false)
              }}
            >
              Copy project link
            </button>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="row-actions-wrap">
      <div className="row-actions">
        <button type="button" aria-label={`Edit ${row.owner}`} onClick={onEdit}>
          <Pencil size={15} />
        </button>
        <button
          type="button"
          aria-label={`Delete ${row.owner}`}
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
        <button
          type="button"
          aria-label={`Share ${row.owner}`}
          onClick={onShare}
        >
          <Share2 size={15} />
        </button>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`More actions for ${row.owner}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>
      {menu}
    </div>
  )
}

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project
  onClose: () => void
  onSave: (next: Project) => void
}) {
  const [draft, setDraft] = useState(project)
  return (
    <div
      className="demo-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <section
        className="demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
      >
        <div className="demo-modal-header">
          <div>
            <span className="kicker">EDIT PROJECT</span>
            <h3 id="edit-project-title">{project.owner}</h3>
          </div>
          <button
            type="button"
            className="demo-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
        <label>
          Owner
          <input
            value={draft.owner}
            onChange={(event) =>
              setDraft({ ...draft, owner: event.target.value })
            }
          />
        </label>
        <label>
          Work location
          <select
            value={draft.location}
            onChange={(event) =>
              setDraft({
                ...draft,
                location: event.target.value as WorkLocation,
              })
            }
          >
            <option>Office</option>
            <option>Remote</option>
          </select>
        </label>
        <label>
          Status
          <select
            value={draft.status}
            onChange={(event) =>
              setDraft({
                ...draft,
                status: event.target.value as ProjectStatus,
              })
            }
          >
            <option>Verified</option>
            <option>Ongoing</option>
            <option>On Hold</option>
            <option>Rejected</option>
          </select>
        </label>
        <label>
          Progress
          <div className="range-control">
            <input
              type="range"
              min="0"
              max="100"
              value={draft.progress}
              onChange={(event) =>
                setDraft({ ...draft, progress: Number(event.target.value) })
              }
              aria-label="Project progress"
            />
            <output className="range-value">{draft.progress}%</output>
          </div>
        </label>
        <div className="demo-modal-footer">
          <button type="button" className="demo-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="demo-primary"
            onClick={() => onSave(draft)}
          >
            Save changes
          </button>
        </div>
      </section>
    </div>
  )
}

export function ProjectTableExample() {
  const [rows, setRows] = useState(projectData)
  const [selection, setSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [visibility, setVisibility] = useState<VisibilityState>({})
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>(
    'default',
  )
  const [editing, setEditing] = useState<Project | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const copyLink = useCallback(
    async (project: Project) => {
      const url = `https://${project.project}`
      try {
        await navigator.clipboard.writeText(url)
        notify('Project link copied')
      } catch {
        notify(url)
      }
    },
    [notify],
  )

  const columns = useMemo<DataTableColumn<Project>[]>(
    () => [
      {
        id: '__expander',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <span className="sr-only">Details</span>,
        cell: ({ row }) => <DataTable.ExpandButton row={row} />,
        size: 38,
        meta: {
          renderExpanded: (row: {
            original: {
              owner:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              role:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              city:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              progress:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
            }
          }) => (
            <div className="expanded-project">
              <strong>{row.original.owner}</strong>
              <span>
                {row.original.role} · {row.original.city} ·{' '}
                {row.original.progress}% complete
              </span>
            </div>
          ),
        },
      },
      {
        id: 'select',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <DataTable.SelectionHeader />,
        cell: ({ row }) => <DataTable.SelectionCell row={row} />,
        size: 48,
      },
      {
        accessorKey: 'owner',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="owner" label="Owner" />
            <DataTable.ColumnFilter columnId="owner" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="owner-cell">
            <DeferredAvatar
              src={row.original.avatar}
              initials={row.original.owner
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
              label={row.original.owner}
              className="owner-avatar"
            />
            <span>
              <strong>{row.original.owner}</strong>
              <small>{row.original.role}</small>
            </span>
          </div>
        ),
        size: 230,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'city',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="city" label="City" />
            <DataTable.ColumnFilter columnId="city" />
          </div>
        ),
        size: 125,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'location',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="location" label="Work Location" />
            <DataTable.ColumnFilter columnId="location" />
          </div>
        ),
        cell: ({ row, getValue }) => (
          <select
            className="inline-select"
            value={getValue() as WorkLocation}
            onChange={(event) =>
              setRows((current) =>
                current.map((item) =>
                  item.id === row.original.id
                    ? { ...item, location: event.target.value as WorkLocation }
                    : item,
                ),
              )
            }
            aria-label={`Work location for ${row.original.owner}`}
          >
            <option>Office</option>
            <option>Remote</option>
          </select>
        ),
        size: 150,
        filterFn: 'arrIncludesSome',
      },
      {
        accessorKey: 'project',
        header: () => <span>Project Link</span>,
        cell: ({ getValue }) => (
          <a
            className="project-link"
            href={`https://${getValue() as string}`}
            target="_blank"
            rel="noreferrer"
          >
            {getValue() as string} <ExternalLink size={12} />
          </a>
        ),
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="status" label="Status" />
            <DataTable.ColumnFilter columnId="status" />
          </div>
        ),
        cell: ({ getValue }) => (
          <StatusBadge status={getValue() as ProjectStatus} />
        ),
        size: 130,
        filterFn: 'arrIncludesSome',
      },
      {
        accessorKey: 'progress',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="progress" label="Progress" />
            <DataTable.ColumnFilter columnId="progress" />
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="progress-cell">
            <span>
              <span style={{ width: `${getValue() as number}%` }} />
            </span>
            <strong>{getValue() as number}%</strong>
          </div>
        ),
        size: 130,
        filterFn: 'inNumberRange',
      },
      {
        accessorKey: 'members',
        header: () => <span>Team Members</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <AvatarStack people={getValue() as Project['members']} />
        ),
        size: 170,
      },
      {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <ProjectActions
            row={row.original}
            onEdit={() => setEditing(row.original)}
            onDelete={() => {
              setRows((current) =>
                current.filter((item) => item.id !== row.original.id),
              )
              setSelection((current) => {
                const next = { ...current }
                delete next[row.original.id]
                return next
              })
              notify(`${row.original.owner} removed`)
            }}
            onShare={() => void copyLink(row.original)}
            onDuplicate={() => {
              const copy = {
                ...row.original,
                id: `${row.original.id}-copy-${Date.now()}`,
                owner: `${row.original.owner} Copy`,
              }
              setRows((current) => [copy, ...current])
              notify('Project duplicated')
            }}
          />
        ),
        size: 150,
      },
    ],
    [copyLink, notify],
  )

  return (
    <>
      <DataTable.Root<Project>
        data={rows}
        columns={columns}
        enableRowSelection
        enableExpanding
        getRowCanExpand={() => true}
        enableColumnResizing
        state={{
          rowSelection: selection,
          sorting,
          columnFilters,
          globalFilter,
          pagination,
          columnVisibility: visibility,
        }}
        onRowSelectionChange={setSelection}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onColumnVisibilityChange={setVisibility}
        initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        meta={{ density, setDensity }}
      >
        <DataTable.Fullscreen>
          <DataTable.Header>
            <DataTable.Toolbar>
              <div className="toolbar-primary">
                <DataTable.Search placeholder="Search owners, cities, projects…" />
                <DataTable.RowCount />
              </div>
              <DataTable.Actions>
                <DataTable.FacetedFilter columnId="status" label="Status" />
                <DataTable.FacetedFilter columnId="location" label="Location" />
                <DataTable.ClearFilters />
                <DataTable.ExportCsv filename="coconut-projects.csv" />
                <DataTable.ViewOptions />
                <DataTable.Density />
                <DataTable.TableOptions />
                <DataTable.FullscreenButton label="Full screen" />
                <DataTable.Reset />
              </DataTable.Actions>
            </DataTable.Toolbar>
            <DataTable.FilterRow />
            <DataTable.BulkActions />
          </DataTable.Header>
          <DataTable.Table striped stickyHeader density={density} />
          <DataTable.Footer>
            <DataTable.Pagination pageSizeOptions={[10, 20, 50]} />
          </DataTable.Footer>
        </DataTable.Fullscreen>
      </DataTable.Root>
      {editing ? (
        <ProjectModal
          project={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setRows((current) =>
              current.map((item) => (item.id === next.id ? next : item)),
            )
            setEditing(null)
            notify('Project updated')
          }}
        />
      ) : null}
      {toast ? (
        <div className="demo-toast" role="status">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      ) : null}
    </>
  )
}
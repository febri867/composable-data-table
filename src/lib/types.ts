import type { RowData } from '@tanstack/react-table'

export type WithId<T extends RowData> = T & { id: string }

# Changelog

All notable changes to this project are documented here.

## [0.1.11]

### Documentation

- Added a full-featured `ProjectDataExample` to the README.
- Added 15 realistic mock project records for demonstrating the table API.
- Documented a complete consumer example using only `coconut-composable-data-table`.
- Demonstrated search, faceted filtering, selection, column resizing, column pinning, visibility controls, CSV export, reset, striped rows, sticky headers, density, row count, and pagination.

## [0.1.10]

### Fixed
- Expanded the README with installation, column definitions, composition, filtering, sorting, pagination, server-side usage, selection, visibility, pinning, resizing, expandable rows, loading, empty states, fullscreen, export, controlled state, and public props.

## [0.1.9]

### Fixed
- Fixed production build errors caused by unused table state variables.
- Fixed global search when no custom global filter function is provided.

## [0.1.8]

### Fixed
- Fixed pagination after applying global or column filters.
- Fixed fullscreen trigger focus after leaving fullscreen mode.

## [0.1.7]

### Fixed
- Fixed pagination count when filters are applied.
- Improved focus handling when exiting fullscreen.

## [0.1.6]

### Fixed
- Fixed table controls not updating correctly after state changes.
- Fixed fullscreen focus restoration when using the portal-based layout.

## [0.1.5]

### Fixed
- Fixed uncontrolled table state updates for pagination, filtering, sorting, selection, and column visibility.
- Improved faceted filtering for both scalar and array values.
- Fixed fullscreen focus restoration.
- Updated table test fixtures for mixed TanStack column value types.
- Fixed sorting test expectations.

## [0.1.4]

### Fixed
- Fixed TanStack column type compatibility in the test suite.
- Fixed sorting behavior covered by the reference table tests.

## [0.1.3]

### Fixed
- Fixed table state updates for pagination, filtering, sorting, selection, and column visibility.
- Improved fullscreen trigger handling across portal transitions.

## [0.1.1]

### Fixed
- Improved controlled and uncontrolled table state handling.
- Improved automatic column labels in table menus and filters.
- Improved fullscreen focus behavior.
- Updated tests for the current component APIs.

## [0.1.0]

### Added
- Initial composable data table implementation.
- TanStack Table integration.
- Sorting, filtering, selection, column visibility, and pagination.
- Loading and empty states.
- Fullscreen table support.
- Storybook and Vitest setup.
- Initial documentation and reference examples.

### Refactored
- Split the table implementation into smaller composable modules.
- Separated reusable library components from demo and documentation code.
- Added typed initial table state configuration.
- Added reusable documentation components.

### Tests
- Added coverage for pagination, search, filtering, sorting, selection, visibility, and fullscreen interactions.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './demo/App'
import { DocsPage } from './docs/DocsPage'
import './styles/globals.css'
import './styles/data-table.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    {window.location.pathname.startsWith('/docs') ? <DocsPage /> : <App />}
  </StrictMode>,
)

import { BookOpen, CheckCircle2, Github, Package } from 'lucide-react'
import { ApiCoverageExample } from '@/examples/ApiCoverageExample'
import { ProjectTableExample } from '@/examples/ProjectTableExample'

export function App() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">
          <span className="brand-mark">K</span> COCONUT LAB · FRONTEND SYSTEMS
        </div>
        <div className="hero-grid">
          <div>
            <h1>
              Composable
              <br />
              Data Table
            </h1>
            <p>
              A production-minded React table library with headless state,
              composable UI primitives, accessible semantics, and a fully
              interactive reference implementation.
            </p>
            <div className="hero-pills">
              <span>
                <CheckCircle2 size={14} /> Type-safe
              </span>
              <span>
                <CheckCircle2 size={14} /> Accessible
              </span>
              <span>
                <CheckCircle2 size={14} /> Headless logic
              </span>
            </div>
            <div className="hero-actions">
              <a className="hero-docs-link" href="/docs">
                <BookOpen size={15} /> Open component docs
              </a>
              <a
                className="hero-docs-link"
                href="https://www.npmjs.com/package/coconut-composable-data-table"
                target="_blank"
                rel="noreferrer"
              >
                <Package size={15} />
                NPM package
              </a>

              <a
                className="hero-docs-link"
                href="https://github.com/febri867/composable-data-table"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={15} />
                GitHub
              </a>
            </div>
          </div>
          <div className="hero-note">
            <span>REFERENCE</span>
            <strong>TanStack Table</strong>
            <p>
              Stable data + column definitions, one table instance, and
              rendering from table APIs.
            </p>
          </div>
        </div>
      </section>

      <section className="demo-card">
        <div className="demo-heading">
          <div>
            <span className="kicker">REFERENCE IMPLEMENTATION</span>
            <h2>Projects & team directory</h2>
            <p>
              96 local records. Every visible interaction is wired: search,
              faceted filter, sorting, selection, pagination, visibility, export
              and row actions.
            </p>
          </div>
          <div className="demo-heading-actions">
            <span className="demo-version">v0.1.9</span>
            <a className="demo-docs-link" href="/docs">
              <BookOpen size={14} /> Docs & Playground
            </a>
          </div>
        </div>
        <ProjectTableExample />
      </section>

      <ApiCoverageExample />

      <section className="principles">
        <article>
          <span>01</span>
          <h3>Library boundary</h3>
          <p>
            The package only exports table primitives and hooks. Demo data,
            product actions, styling, and reference screens live outside the
            package entry point.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Composable state</h3>
          <p>
            TanStack Table owns row-model state. Consumers can control filters,
            sorting, pagination and selection without coupling the library to
            networking.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Real interactions</h3>
          <p>
            The home page is a reference app, not a static mock: edit, delete,
            duplicate, share, search, filter, sort and paginate all have
            observable behavior.
          </p>
        </article>
      </section>
    </main>
  )
}

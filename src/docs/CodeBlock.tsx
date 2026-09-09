import { useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

function highlightLine(line: string, lineIndex: number) {
  const tokenPattern =
    /(\/\/.*$|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|export|import|from|type|interface|extends|async|await|new|if|else|true|false|null|undefined|as|typeof|keyof|boolean|string|number)\b|\b\d+(?:\.\d+)?\b|<\/?[A-Z][A-Za-z0-9.]*)/g
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = tokenPattern.exec(line))) {
    if (match.index > cursor) nodes.push(line.slice(cursor, match.index))
    const token = match[0]
    let className = 'tok-punctuation'
    if (token.startsWith('//') || token.startsWith('/*'))
      className = 'tok-comment'
    else if (/^['"`]/.test(token)) className = 'tok-string'
    else if (/^\d/.test(token)) className = 'tok-number'
    else if (/^<\/?[A-Z]/.test(token)) className = 'tok-tag'
    else className = 'tok-keyword'
    nodes.push(
      <span className={className} key={`${lineIndex}-${match.index}`}>
        {token}
      </span>,
    )
    cursor = match.index + token.length
  }
  if (cursor < line.length) nodes.push(line.slice(cursor))
  return nodes
}

function CodeBlock({
  children,
  language = 'tsx',
}: {
  children: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }
  const lines = children.replace(/\n$/, '').split('\n')
  return (
    <div className="docs-code-wrap">
      <div className="docs-code-toolbar">
        <span className="docs-code-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="docs-code-language">{language}</span>
        <button
          className="docs-copy"
          type="button"
          onClick={() => void copy()}
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}{' '}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="docs-code">
        <code>
          {lines.map((line, index) => (
            <span className="docs-code-line" key={index}>
              <span className="docs-line-number">{index + 1}</span>
              <span className="docs-line-content">
                {highlightLine(line, index)}
              </span>
              {index < lines.length - 1 ? '\n' : null}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export { CodeBlock }

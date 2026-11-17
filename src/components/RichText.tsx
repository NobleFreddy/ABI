import katex from 'katex'
import { Fragment, useMemo } from 'react'

/**
 * Zeigt Text mit einfachen Auszeichnungen:
 *  $…$   → Formel (KaTeX), $$…$$ → abgesetzte Formel
 *  **…** → fett
 *  Zeilenumbrüche → <br>, Zeilen mit "- " → Aufzählung
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = useMemo(() => parseBlocks(text), [text])
  return (
    <div className={className}>
      {blocks.map((b, i) =>
        b.type === 'list' ? (
          <ul key={i} className="my-1 list-disc space-y-0.5 pl-5">
            {b.items.map((it, k) => (
              <li key={k}>
                <Inline text={it} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-1 first:mt-0 last:mb-0">
            {b.lines.map((l, k) => (
              <Fragment key={k}>
                {k > 0 && <br />}
                <Inline text={l} />
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  )
}

type Block = { type: 'p'; lines: string[] } | { type: 'list'; items: string[] }

function parseBlocks(text: string): Block[] {
  const out: Block[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    const last = out[out.length - 1]
    if (/^\s*[-•]\s+/.test(line)) {
      const item = line.replace(/^\s*[-•]\s+/, '')
      if (last?.type === 'list') last.items.push(item)
      else out.push({ type: 'list', items: [item] })
    } else if (line.trim() === '') {
      out.push({ type: 'p', lines: [] })
    } else if (last?.type === 'p') {
      last.lines.push(line)
    } else {
      out.push({ type: 'p', lines: [line] })
    }
  }
  return out.filter((b) => (b.type === 'p' ? b.lines.length > 0 : true))
}

function Inline({ text }: { text: string }) {
  const parts = useMemo(() => splitMath(text), [text])
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'math') {
          const html = katex.renderToString(p.value, { throwOnError: false, displayMode: p.display, strict: false })
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} className={p.display ? 'my-1 block overflow-x-auto' : undefined} />
        }
        return <Bold key={i} text={p.value} />
      })}
    </>
  )
}

function Bold({ text }: { text: string }) {
  const segs = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {segs.map((s, i) =>
        s.startsWith('**') && s.endsWith('**') ? (
          <strong key={i} className="font-semibold">
            {s.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{s}</Fragment>
        ),
      )}
    </>
  )
}

type Part = { kind: 'text'; value: string } | { kind: 'math'; value: string; display: boolean }

function splitMath(text: string): Part[] {
  const parts: Part[] = []
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ kind: 'text', value: text.slice(last, m.index) })
    parts.push({ kind: 'math', value: m[1] ?? m[2], display: m[1] != null })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ kind: 'text', value: text.slice(last) })
  return parts
}

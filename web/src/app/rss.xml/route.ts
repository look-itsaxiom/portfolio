import { getAllDevlog, getDevlogBySlug } from "@/lib/content"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SOCIAL } from "@/lib/seo"

export const dynamic = "force-static"

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Minimal markdown -> HTML for feed readers. Full fidelity lives on the site. */
function mdToHtml(md: string): string {
  const blocks = md.trim().split(/\n{2,}/)
  return blocks
    .map((block) => {
      const b = block.trim()
      if (!b) return ""
      const heading = b.match(/^(#{1,6})\s+(.*)$/)
      if (heading) {
        const level = Math.min(heading[1].length + 1, 6)
        return `<h${level}>${esc(heading[2])}</h${level}>`
      }
      if (/^[-*]\s+/m.test(b) && b.split("\n").every((l) => /^[-*]\s+/.test(l.trim()))) {
        const items = b
          .split("\n")
          .map((l) => `<li>${inline(l.trim().replace(/^[-*]\s+/, ""))}</li>`)
          .join("")
        return `<ul>${items}</ul>`
      }
      if (b.startsWith("```")) {
        const code = b.replace(/^```[a-z]*\n?/, "").replace(/```$/, "")
        return `<pre><code>${esc(code)}</code></pre>`
      }
      return `<p>${inline(b.replace(/\n/g, " "))}</p>`
    })
    .join("\n")
}

function inline(s: string): string {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
}

export async function GET() {
  const entries = getAllDevlog()
    .filter((e) => e.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const items = entries
    .map((entry) => {
      let html = ""
      try {
        html = mdToHtml(getDevlogBySlug(entry.slug).content || "")
      } catch {
        html = `<p>${esc(entry.summary || "")}</p>`
      }
      const url = `${SITE_URL}/devlog/${entry.slug}`
      const pub = new Date(`${entry.date}T12:00:00Z`).toUTCString()
      const cats = (entry.tags || [])
        .map((t) => `<category>${esc(t)}</category>`)
        .join("")
      return `    <item>
      <title>${esc(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(entry.summary || "")}</description>
      ${cats}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`
    })
    .join("\n")

  const latest = entries[0]
  const built = latest
    ? new Date(`${latest.date}T12:00:00Z`).toUTCString()
    : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(SITE_NAME)} — Devlog</title>
    <link>${SITE_URL}/devlog</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${built}</lastBuildDate>
    <managingEditor>${esc(SOCIAL.email)} (${esc(SITE_NAME)})</managingEditor>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}

// https://github.com/mixu/htmlparser-to-html
import { isDataNode, isElement } from "./typeGuard"
import type { Node } from "domhandler"

const emptyTags = [
  "area", "base", "basefont", "br", "col",
  "frame", "hr", "img", "input", "isindex", 
  "link", "meta", "param", "embed", "?xml",
]

const escape = (s: string) => s.replace(
  /[&'`"<>]/g,
  (e) => (
    ({
      "&": "&amp;",
      "'": "&#x27;",
      "`": "&#x60;",
      "\"": "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    } as Record<string, string>)[e]
  )
)

export default function toHtml(item?: Node | Node[]): string {
  if (Array.isArray(item)) return item.map(toHtml).join("")
  if (!item || !item.type) return ""

  if (isDataNode(item)) switch (item.type) {
    case "text": return item.data
    case "directive": return `<${item.data}>`
    case "comment": return `<!-- ${item.data} -->`
    case "cdata": return `<!CDATA['${item.data}']>`
  }

  if (!isElement(item)) return ""
  if (item.fragment) return toHtml(item.children)
  
  const { name, attribs, children } = item
  const keys = Object.keys(attribs)

  const start = `<${name}${
    keys.length 
      ? " " + keys.map((key) => attribs[key] ? `${key}="${escape(attribs[key])}"` : key).join(" ") 
      : ""
  }>`

  const inner = children.length ? toHtml(children) : ""
  const end = emptyTags.includes(name) ? "" : `</${name}>`

  return start + inner + end
}

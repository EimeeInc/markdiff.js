import { isElement } from "@/utils/typeGuard"
import { parseDOM } from "htmlparser2"
import Operation from "./Operation"
import toHtml from "@/utils/toHtml"

export default class AddChildOperation extends Operation {

  get insertedNode() {
    const { _insertedNode: node } = this
    if (!node) return undefined

    if (isElement(node) && (node.name === "li" || node.name === "tr")) {
      node.attribs.class = (node.attribs?.class?.split(" ") ?? []).concat("added").join(" ")
      node.children = parseDOM(`<ins>${toHtml(node)}</ins>`)
      return node
    } else {
      return parseDOM(`<ins>${toHtml(node)}</ins>`)[0]
    }
  }
}

import { isElement } from "@/utils/typeGuard"
import { parseDOM } from "htmlparser2"
import Operation from "./Operation"
import toHtml from "@/utils/toHtml"
import type { Element } from "domhandler"

export default class AddPreviousSiblingOperation extends Operation {

  get insertedNode() {
    const { _insertedNode: node } = this
    if (!node) return undefined

    if (isElement(node) && (node.name === "li" || node.name === "tr")) {
      const clone = parseDOM(`<ins class="ins">${toHtml(node)}</ins>`)[0] as Element
      const element = clone.children[0] as Element
      element.attribs.class = (node.attribs?.class?.split(" ") ?? []).concat("added").join(" ")
      return clone
    } else {
      return parseDOM(`<ins class="ins">${toHtml(node)}</ins>`)[0]
    }
  }
}

import { isElement } from "@/utils/typeGuard"
import { parseDOM } from "htmlparser2"
import Operation from "./Operation"
import toHtml from "@/utils/toHtml"

export default class RemoveOperation extends Operation {

  readonly priority = 2

  get insertedNode() {
    const { targetNode: node } = this

    if (isElement(node) && (node.name === "li" || node.name === "tr")) {
      node.attribs.class = "removed"
      node.children = parseDOM(`<del class="del">${toHtml(node.children)}</del>`)
      return node
    } else {
      return parseDOM(`<del class="del">${toHtml(node)}</del>`)[0]
    }
  }
}

import { diffChars } from "diff"
import { parseDOM } from "htmlparser2"
import Operation from "./Operation"
import toHtml from "@/utils/toHtml"
import type { Node } from "domhandler"

type ConstructorArgs = {
  afterNode: Node;
} & ConstructorParameters<typeof Operation>[0]

export default class TextDiffOperation extends Operation {

  readonly priority = 1

  private readonly afterNode: Node

  constructor({ afterNode, ...rest }: ConstructorArgs) {
    super(rest)
    this.afterNode = afterNode
  }

  get insertedNode() {
    const beforeElements = toHtml(this.targetNode)
    const afterElements = toHtml(this.afterNode)

    const html = diffChars(beforeElements, afterElements)
      .filter(({ added, removed }) => added || removed)
      .map(({ added, removed, value }) =>
        added ? `<ins>${value}</ins>`
        : removed ? `<del class="del">${value}</del>`
        : "",
      )
      .join("")

    const node = parseDOM(`<span>${html}</span>`)[0]
    node.fragment = true

    return node
  }
}

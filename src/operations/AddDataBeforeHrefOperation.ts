import Operation from "./Operation"
import type { Node } from "domhandler"

type ConstructorArgs = {
  afterHref: Node;
} & ConstructorParameters<typeof Operation>[0]

export default class AddDataBeforeHrefOperation extends Operation {

  readonly afterHref: Node

  constructor({ afterHref, ...rest }: ConstructorArgs) {
    super(rest)
    this.afterHref = afterHref
  }
}

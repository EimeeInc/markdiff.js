import Operation from "./Operation"
import type { Node } from "domhandler"

type ConstructorArgs = {
  afterTagName: Node;
} & ConstructorParameters<typeof Operation>[0]

export default class AddDataBeforeTagNameOperation extends Operation {

  readonly afterTagName: Node

  constructor({ afterTagName, ...rest }: ConstructorArgs) {
    super(rest)
    this.afterTagName = afterTagName
  }
}

import Operation from "./Operation"

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
    // TODO
    return undefined
  }
}

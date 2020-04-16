import type { Node } from "domhandler"

type ConstructorArgs = {
  insertedNode?: Node;
  targetNode: Node;
}

export default class Operation {

  readonly priority: number = 3
  
  readonly targetNode: Node

  protected _insertedNode?: Node

  constructor({ insertedNode, targetNode }: ConstructorArgs) {
    this._insertedNode = insertedNode
    this.targetNode = targetNode
  }

  get insertedNode() {
    return this._insertedNode
  }
}

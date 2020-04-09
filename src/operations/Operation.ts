import type { Node } from "domhandler"

type ConstructorArgs = {
  insertedNode?: Node;
  targetNode: Node;
}

export default class Operation {

  readonly priority = 3
  
  readonly targetNode: Node

  insertedNode?: Node

  constructor({ insertedNode, targetNode }: ConstructorArgs) {
    this.insertedNode = insertedNode
    this.targetNode = targetNode
  }
}

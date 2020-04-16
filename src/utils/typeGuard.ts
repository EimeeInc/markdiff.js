import type { DataNode, Element, Node } from "domhandler"

export const isDataNode = (item: Node): item is DataNode => !!(item as DataNode).data
export const isElement = (item: Node): item is Element => !!(item as Element).attribs

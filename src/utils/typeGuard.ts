import type { DataNode, Element, Node } from "domhandler"

export const isDataNode = (item: Node): item is DataNode => 
  (["comment", "text", "directive", "cdata"].includes(item.type)) && !!(item as DataNode).data

export const isElement = (item: Node): item is Element => 
  (["script", "style", "tag"].includes(item.type)) && !!(item as Element).attribs

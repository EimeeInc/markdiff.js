import {
  AddChildOperation,
  AddDataBeforeHrefOperation,
  AddDataBeforeTagNameOperation,
  AddPreviousSiblingOperation,
  Operation,
  RemoveOperation,
  TextDiffOperation,
} from "./operations"
import { diffArrays } from "diff"
import { isElement } from "./utils/typeGuard"
import { parseDOM } from "htmlparser2"
import toHtml, { clone } from "./utils/toHtml"
import type { Node } from "domhandler"

declare module "domhandler" {
  interface Node {
    fragment?: boolean;
  }
}

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]

/**
 * @param before 
 * @param after 
 * @return True if given 2 nodes are both hN nodes and have different N (e.g. h1 and h2)
 */
const detectHeadingLevelDifference = (before: Node, after: Node) =>
  isElement(before)
  && isElement(after)
  && HEADINGS.includes(before.name)
  && HEADINGS.includes(after.name)
  && toHtml(before.children) === toHtml(after.children)

/**
 * @param before 
 * @param after 
 * @return True if given 2 nodes are both "a" nodes and have different href attributes
 */
const detectHrefDifference = (before: Node, after: Node) =>
  isElement(before)
  && isElement(after)
  && before.name === "a"
  && after.name === "a"
  && before.attribs.href !== after.attribs.href
  && toHtml(before.children) === toHtml(after.children)

const markLiOrTrAsChanged = (node: Node) => {
  while (node.parent && !node.parent.fragment) {
    if (isElement(node) && (node.name === "li" || node.name === "tr")) {
      const { class: clazz } = node.attribs

      if (!["added", "changed", "removed"].some((e) => clazz.includes(e))) {
        node.attribs.class = clazz.split(" ").concat("changed").join(" ")
      }
    }

    if (!node.parent) break
    node = node.parent
  }
}

const markTopLevelNodeAsChanged = (node: Node) => {
  if (!node) return
  while (node.parent && !node.parent.fragment) node = node.parent

  if (isElement(node) && !node.parent && node.attribs.class !== "changed") {
    const children = clone(node)
    node.name = "div"
    node.attribs.class = "changed"
    node.children = children
  }
}

/**
 * 1. Create identity map and collect patches from descendants
 *   1-1. Detect exact-matched nodes
 *   1-2. Detect partial-matched nodes and recursively walk through its children
 * 2. Create remove operations from identity map
 * 3. Create insert operations from identity map
 * 4. Return operations as a patch
 * 
 * @param before
 * @param after
 * @return operations
 */
const createPatchFromChildren = (before: Node, after: Node): Operation[] => {
  const operations: Operation[] = []
  const identityMap = new Map<Node, Node>()
  const invertedIdentityMap = new Map<Node, Node>()

  if (!(isElement(before) && isElement(after))) return []

  let beforeIndex = 0
  let afterIndex = 0

  diffArrays(before.children.map(toHtml), after.children.map(toHtml)).forEach(({ added, removed }) => {
    if (removed) beforeIndex++
    else if (added) afterIndex++

    else {
      const beforeChild = before.children[beforeIndex]
      const afterChild = after.children[afterIndex]
      identityMap.set(beforeChild, afterChild)
      invertedIdentityMap.set(afterChild, beforeChild)
    }
  })

  // TODO
  return []
}

export const applyPatch = (operations: Operation[], node: Node) => {
  operations.sort((e) => e.priority).forEach((operation) => {
    const { targetNode, insertedNode } = operation
    
    switch (operation.constructor) {
      case AddChildOperation:
        if (isElement(targetNode) && insertedNode) {
          targetNode.children.push(insertedNode)
          markLiOrTrAsChanged(targetNode)
          markTopLevelNodeAsChanged(targetNode)
        }
        break

      case AddDataBeforeHrefOperation:
        if (isElement(targetNode)) {
          targetNode.attribs["data-before-href"] = targetNode.attribs.href
          targetNode.attribs.href = (operation as AddDataBeforeHrefOperation).afterHref
          markLiOrTrAsChanged(targetNode)
          markTopLevelNodeAsChanged(targetNode)
        }
        break

      case AddDataBeforeTagNameOperation:
        if (isElement(targetNode)) {
          targetNode.attribs["data-before-tag-name"] = targetNode.name
          targetNode.name = (operation as AddDataBeforeTagNameOperation).afterTagName
          markLiOrTrAsChanged(targetNode)
          markTopLevelNodeAsChanged(targetNode)
        }
        break

      case AddPreviousSiblingOperation:
        if (isElement(targetNode) && insertedNode) {
          targetNode.parent?.children.splice(0, 0, insertedNode)
          
          if (targetNode.name !== "li" && targetNode.name !== "tr") {
            markLiOrTrAsChanged(targetNode)
          }
          markTopLevelNodeAsChanged(targetNode)
        }
        break

      case RemoveOperation:
        if (targetNode !== insertedNode) {
          Object.assign(operation.targetNode, insertedNode)
        }
        markLiOrTrAsChanged(targetNode)
        markTopLevelNodeAsChanged(targetNode)
        break

      case TextDiffOperation:
        Object.assign(operation.targetNode, insertedNode)

        if (targetNode.parent) {
          markLiOrTrAsChanged(targetNode.parent)
          markTopLevelNodeAsChanged(targetNode.parent)
        }
        break
    }
  })

  return node
}

export const createPatch = (before: Node, after: Node): Operation[] =>
  toHtml(before) === toHtml(after) ? [] : createPatchFromChildren(before, after)

export const render = (before: string, after: string) => {
  const beforeNode = parseDOM(before)[0]
  beforeNode.fragment = true

  const afterNode = parseDOM(after)[0]
  afterNode.fragment = true

  const patch = createPatch(beforeNode, afterNode)
  applyPatch(patch, beforeNode)
}

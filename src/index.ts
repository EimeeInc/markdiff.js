import { diffArrays } from "diff"
import { parseDOM } from "htmlparser2"
import deepEqual from "deep-equal"
import type { Element, Node } from "domhandler"

import {
  AddChildOperation,
  AddDataBeforeHrefOperation,
  AddDataBeforeTagNameOperation,
  AddPreviousSiblingOperation,
  Operation,
  RemoveOperation,
  TextDiffOperation,
} from "./operations"
import { isElement } from "./utils/typeGuard"
import toHtml from "./utils/toHtml"

declare module "domhandler" {
  interface Node {
    fragment?: boolean;
    children?: Node[];
  }
}

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]

/**
 * @param before 
 * @param after 
 * @return True if given 2 nodes are both hN nodes and have different N (e.g. h1 and h2)
 */
const detectHeadingLevelDifference = (before: Element, after: Element): boolean =>
  HEADINGS.includes(before.name)
  && HEADINGS.includes(after.name)
  && toHtml(before.children) === toHtml(after.children)

/**
 * @param before 
 * @param after 
 * @return True if given 2 nodes are both "a" nodes and have different href attributes
 */
const detectHrefDifference = (before: Element, after: Element): boolean =>
  before.name === "a"
  && after.name === "a"
  && before.attribs.href !== after.attribs.href
  && toHtml(before.children) === toHtml(after.children)

function markLiOrTrAsChanged(node: Node): void {
  while (node.parent && !node.parent.fragment) {
    if (isElement(node) && (node.name === "li" || node.name === "tr")) {
      const { class: clazz = "" } = node.attribs

      if (!["added", "changed", "removed"].some((e) => clazz.includes(e))) {
        node.attribs.class = clazz.split(" ").concat("changed").filter((e) => e).join(" ")
      }
    }

    if (!node.parent) break
    node = node.parent
  }
}

function markTopLevelNodeAsChanged(node?: Node | null): void {
  if (!node) return
  while (node.parent && !node.parent.fragment) node = node.parent

  if (isElement(node) && node.parent && node.attribs.class !== "changed") {
    const clone = { ...node, attribs: { ...node.attribs } }
    node.name = "div"
    node.attribs.class = "changed"
    node.children = [clone]
  }
}

function addPreviousSibling(targetNode: Node, insertedNode: Node): void {
  const { parent } = targetNode
  if (!parent) return

  const { children } = parent
  const index = children.findIndex((e) => e === targetNode)
  children.splice(index, 0, insertedNode)
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
function createPatchFromChildren(before: Node, after: Node): Operation[] {
  if (!before.children) before.children = []
  if (!after.children) after.children = []

  const operations: Operation[] = []
  const identityMap = new Map<Node, Node>()
  const invertedIdentityMap = new Map<Node, Node>()

  // Map only equal parts
  let beforeIndex = 0
  let afterIndex = 0

  const beforeHtmlList = before.children.map(toHtml)
  const afterHtmlList = after.children.map(toHtml)

  while (beforeIndex < beforeHtmlList.length && afterIndex < afterHtmlList.length) {
    const beforeHtml = beforeHtmlList[beforeIndex]
    const afterHtml = afterHtmlList[afterIndex]

    if (beforeHtml === afterHtml) {
      const beforeChild = before.children[beforeIndex++]
      const afterChild = after.children[afterIndex++]

      identityMap.set(beforeChild, afterChild)
      invertedIdentityMap.set(afterChild, beforeChild)

    } else {
      const beforeRest = beforeHtmlList.length - beforeIndex
      const afterRest = afterHtmlList.length - afterIndex

      if (beforeRest >= afterRest) beforeIndex++
      if (beforeRest <= afterRest) afterIndex++
    }
  }

  // Partial matching
  for (const beforeChild of before.children) {
    if (identityMap.get(beforeChild)) continue

    for (const afterChild of after.children) {
      if (identityMap.get(beforeChild)) break
      else if (invertedIdentityMap.get(afterChild)) continue

      else if (beforeChild.type === "text") {
        if (afterChild.type === "text") {
          identityMap.set(beforeChild, afterChild)
          invertedIdentityMap.set(afterChild, beforeChild)
          operations.push(new TextDiffOperation({ targetNode: beforeChild, afterNode: afterChild }))
        }
      }

      else if (isElement(beforeChild) && isElement(afterChild) && beforeChild.name === afterChild.name) {
        if (deepEqual(beforeChild.attribs, afterChild.attribs)) {
          identityMap.set(beforeChild, afterChild)
          invertedIdentityMap.set(afterChild, beforeChild)
          operations.push(...createPatch(beforeChild, afterChild))

        } else if (detectHrefDifference(beforeChild, afterChild)) {
          operations.push(new AddDataBeforeHrefOperation({ afterHref: afterChild.attribs.href, targetNode: beforeChild }))
          identityMap.set(beforeChild, afterChild)
          invertedIdentityMap.set(afterChild, beforeChild)
          operations.push(...createPatch(beforeChild, afterChild))
        }
      }

      else if (isElement(beforeChild) && isElement(afterChild) && detectHeadingLevelDifference(beforeChild, afterChild)) {
        operations.push(new AddDataBeforeTagNameOperation({ afterTagName: afterChild.name, targetNode: beforeChild }))
        identityMap.set(beforeChild, afterChild)
        invertedIdentityMap.set(afterChild, beforeChild)
      }
    }
  }

  for (const beforeChild of before.children) if (!identityMap.get(beforeChild)) {
    operations.push(new RemoveOperation({ targetNode: beforeChild }))
  }

  for (const afterChild of after.children) if (!invertedIdentityMap.get(afterChild)) {
    let rightNode = afterChild.nextSibling

    while (true) {
      if (!rightNode) {
        operations.push(new AddChildOperation({ insertedNode: afterChild, targetNode: before }))
        break
      }

      const targetNode = invertedIdentityMap.get(rightNode)

      if (targetNode) {
        operations.push(new AddPreviousSiblingOperation({ insertedNode: afterChild, targetNode }))
        break

      } else {
        rightNode = rightNode.nextSibling
      }
    }
  }

  return operations
}

export function createPatch(before: Node, after: Node): Operation[] {
  return toHtml(before) === toHtml(after) ? [] : createPatchFromChildren(before, after)
}

export function applyPatch(operations: Operation[], node: Node): Node {
  operations.sort((a, b) => b.priority - a.priority).forEach((operation) => {
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
          addPreviousSibling(targetNode, insertedNode)
          
          if (targetNode.name !== "li" && targetNode.name !== "tr") {
            markLiOrTrAsChanged(targetNode)
          }
          markTopLevelNodeAsChanged(targetNode.parent)
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
        const parent = operation.targetNode.parent
        Object.assign(operation.targetNode, insertedNode)
        targetNode.parent = parent

        if (targetNode.parent) {
          markLiOrTrAsChanged(targetNode.parent)
          markTopLevelNodeAsChanged(targetNode.parent)
        }
        break
    }
  })

  return node
}

export function toTree(before: string, after: string): Node {
  const beforeNode = parseDOM(`<fragment>${before}</fragment>`)[0]
  beforeNode.fragment = true

  const afterNode = parseDOM(`<fragment>${after}</fragment>`)[0]
  afterNode.fragment = true

  const patch = createPatch(beforeNode, afterNode)
  return applyPatch(patch, beforeNode)
}

export default function render(before: string, after: string): string {
  return toHtml(toTree(before, after))
}

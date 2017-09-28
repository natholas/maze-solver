import { PathNode } from './path-node.class'

export class Neighbour {
  node: PathNode
  dist: number
  constructor(node: PathNode, dist: number) {
    this.node = node
    this.dist = dist
  }
}
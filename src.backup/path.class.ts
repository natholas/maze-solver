import * as functions from './functions'
import { PathNode } from './path-node.class'

export class Path {
  nodes: PathNode[]
  visited: PathNode[] = []
  deadEnd: boolean = false

  constructor(nodes: PathNode[]) {
    this.nodes = nodes
    this.visited = functions.arrayCopy(nodes)
  }

  next() {
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      for (let neighbour of this.nodes[i].neighbours) {
        if (this.visited.indexOf(neighbour.node) < 0) {
          this.nodes.push(neighbour.node)
          this.visited.push(neighbour.node)
          return true
        }
      }
      this.nodes.splice(i, 1)
    }
    return false
  }

  get lastNode() {
    return this.nodes[this.nodes.length - 1]
  }

  // breakOffDeadEndNodes() {
  //   let lastNode: PathNode
  //   for (var i = this.visited.length - 1; i >= 0; i--) {
  //     let node = this.visited[i]

  //     if (node.neighbours.length > 1 && lastNode) {
  //       for (var ii = 0; ii < node.neighbours.length; ii++) {
  //         if (node.neighbours[ii].node === lastNode) {
  //           node.neighbours.splice(ii, 1)
  //           return
  //         }
  //       }
  //     }

  //     lastNode = node
  //   }
  // }

  multipleUnvisitedNeighbours() {
    let count = 0
    let lastNode = this.lastNode
    if (!lastNode) return false
    for (let neighbour of lastNode.neighbours) {
      if (this.visited.indexOf(neighbour.node) < 0) count += 1
      if (count > 1) return true
    }
  }

  copy() {
    let path = new Path(functions.arrayCopy(this.nodes))
    path.visited = functions.arrayCopy(this.visited)
    return path
  }

  get dist() {
    let dist = 0
    let lastNode = this.nodes[0]
    for (let node of this.nodes) {
      if (node == lastNode) continue
      dist += node.pos.dist(lastNode.pos)
      lastNode = node
    }
    return dist
  }
}
import * as functions from './functions'
import { Vector } from './vector.class'
import { Neighbour } from './neighbour.class'
import { PathNode } from './path-node.class'
import { Path } from './path.class'


export class Canvas {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  pixels: boolean[]
  nodes: PathNode[]
  entrance: PathNode
  exit: PathNode

  constructor() {
    this.el = document.createElement('canvas')
    this.ctx = this.el.getContext('2d')
    document.body.appendChild(this.el)
  }

  public draw(imgSrc: string, callback: Function) {
    const image = new Image(60, 45);
    const t = this
    image.onload = function () {
      t.el.width = image.naturalWidth - 2;
      t.el.height = image.naturalHeight - 2;
      t.ctx.drawImage(image, -1, -1, image.naturalWidth, image.naturalHeight);
      callback()
    }
    image.src = imgSrc;
  }

  private getNodeFromPos(pos: Vector) {
    for (let node of this.nodes) {
      if (node.pos.x === pos.x && node.pos.y == pos.y) {
        return node
      }
    }
  }

  private getDir(from: Vector, to: Vector) {
    if (from.x > to.x) return new Vector(1, 0)
    if (from.x < to.x) return new Vector(-1, 0)
    if (from.y > to.y) return new Vector(0, 1)
    if (from.y < to.y) return new Vector(0, -1)
  }

  private getPositionsBetween(pos: Vector, to: Vector) {
    let positions: Vector[] = []
    if (!to) return positions
    let dir = this.getDir(to, pos)

    while (true) {
      pos = pos.add(dir)
      positions.push(pos)

      if (pos.equals(to)) {
        break
      }
    }
    return positions
  }

  private getPathPositions(path: PathNode[]) {
    let output: Vector[] = [path[0].pos]

    for (let i = 0, j = 1; i < path.length; i = j++) {
      if (path[j]) {
        let squares = this.getPositionsBetween(path[i].pos, path[j].pos)
        for (let pos of squares) {
          output.push(pos)
        }
      }
    }

    return output
  }

  private drawNodes() {
    this.ctx.beginPath()
    for (let node of this.nodes) {
      this.ctx.rect(node.pos.x, node.pos.y, 1, 1)
    }
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)'
    this.ctx.fill()
  }

  private drawPositions(positions: Vector[]) {
    let i = 0
    for (let pos of positions) {
      i++
      this.ctx.beginPath()
      this.ctx.rect(pos.x, pos.y, 1, 1)
      let rgb = functions.getRgb((100 / positions.length) * i)
      this.ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
      this.ctx.fill()
    }
  }

  private drawEntranceAndExit() {
    this.ctx.beginPath()
    this.ctx.rect(this.entrance.pos.x, this.entrance.pos.y, 1, 1)
    this.ctx.fillStyle = 'red'
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.rect(this.exit.pos.x, this.exit.pos.y, 1, 1)
    this.ctx.fillStyle = 'red'
    this.ctx.fill()
  }

  private processImgData(rawImgData: Uint8ClampedArray) {
    let pixels = []
    for (var i = 0; i < rawImgData.length; i += 4) {
      pixels.push(!!rawImgData[i])
    }
    return pixels
  }

  private indexToPos(index: number) {
    return new Vector(
      index % this.el.width,
      Math.floor(index / this.el.width)
    )
  }

  private posToIndex(pos: Vector) {
    return pos.x + pos.y * this.el.width
  }

  private createNodes() {
    const nodes: PathNode[] = []

    for (let c = 0; c < this.pixels.length; c++) {
      if (!this.pixels[c]) continue
      let pos = this.indexToPos(c)
      let left = this.pixels[this.posToIndex(pos.add(new Vector(-1, 0)))]
      let right = this.pixels[this.posToIndex(pos.add(new Vector(1, 0)))]
      let down = this.pixels[this.posToIndex(pos.add(new Vector(0, 1)))]
      let up = this.pixels[this.posToIndex(pos.add(new Vector(0, -1)))]

      if (left && down || !left && !down || !left && !up || left && up || up && down && right || !up && !down && !right) {
        nodes.push(new PathNode(this.indexToPos(c)))
      }
    }
    return nodes
  }

  private assignNeighbours() {
    for (let node of this.nodes) {
      node.neighbours = this.findNeighbours(node)
    }
  }

  private findNeighbours(node: PathNode) {
    let neighbours: Neighbour[] = []
    let dirs = [
      new Vector(0, 1),
      new Vector(0, -1),
      new Vector(1, 0),
      new Vector(-1, 0)
    ]

    for (let dir of dirs) {
      let end = false
      let dist = 0
      while (!end) {
        dist += 1
        let pos = node.pos.add(dir.times(dist))
        if (!this.pixels[this.posToIndex(pos)]) {
          end = true
          continue
        }
        let foundNode = this.getNodeFromPos(pos)
        if (foundNode) {
          neighbours.push(new Neighbour(foundNode, dist))
          end = true
        }
      }
    }

    return neighbours
  }

  private setup() {
    const rawImgData = this.ctx.getImageData(0, 0, this.el.width, this.el.height)
    this.pixels = this.processImgData(rawImgData.data)
    this.nodes = this.createNodes()
    this.assignNeighbours()
    this.entrance = this.findEntrance()
    this.exit = this.findExit()
  }

  private findEntrance() {
    for (let node of this.nodes) {
      if (node.pos.y === 0 || node.pos.x === 0 || node.pos.y === this.el.width - 1 || node.pos.x === this.el.width - 1) {
        return node
      }
    }
  }

  private findExit() {
    for (let node of this.nodes) {
      if (node === this.entrance) continue
      if (node.pos.y === 0 || node.pos.x === 0 || node.pos.y === this.el.width - 1 || node.pos.x === this.el.width - 1) {
        return node
      }
    }
  }

  private pathLength(path: Neighbour[]) {
    let length = 0
    for (let neighbour of path) {
      length += neighbour.dist
    }
    return length
  }

  private getShortestNeighbour(node: PathNode, blackList: PathNode[]) {
    let shortestNeighbour: Neighbour

    for (let neighbour of node.neighbours) {
      if (blackList.indexOf(neighbour.node) > -1) continue
      if (!shortestNeighbour || neighbour.dist < shortestNeighbour.dist) {
        shortestNeighbour = neighbour
      }
    }

    return shortestNeighbour
  }

  private hasExitNeighbour(node: PathNode) {
    for (let neighbour of node.neighbours) {
      if (neighbour.node == this.exit) {
        return neighbour
      }
    }
  }

  private findNodeInPath(node: PathNode, path: Neighbour[]) {
    for (let neighbour of path) {
      if (neighbour.node === node) return neighbour
    }
  }

  private allNeighboursVisited(node: PathNode, visited: PathNode[]) {
    for (let neighbour of node.neighbours) {
      if (visited.indexOf(neighbour.node) < 0) return false
    }
    return true
  }

  public shortestPath(paths: Path[]) {
    let shortest: Path
    for (let path of paths) {
      if (path.deadEnd) continue
      if (!shortest || path.dist < shortest.dist) {
        shortest = path
      }
    }
    return shortest
  }

  public solve() {
    this.setup()
    let paths: Path[] = [new Path([this.entrance])]

    while (true) {
      let path = this.shortestPath(paths)

      if (path.lastNode == this.exit) {
        console.log("found, lenth: + " + path.nodes.length);
        break;
      }

      // let multiple = path.multipleUnvisitedNeighbours()

      let next = path.next()
      // if (!next) {
      //   path.deadEnd = true
      // } else if (path.nodes.length > 1 && multiple) {
      //   let newPath = path.copy()
      //   newPath.nodes.splice(newPath.nodes.length - 1, 1)
      //   paths.push(newPath)
      // }
    }
    this.drawPositions(this.getPathPositions(paths[0].nodes))
    // this.drawNodes()
  }
}
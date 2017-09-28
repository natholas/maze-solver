import { MazeNode } from './maze-node.class'
import { Vector } from './vector.class'

export class Maze {
  pixels: boolean[]
  width: number

  constructor(pixels: boolean[], width: number) {
    this.pixels = pixels
    this.width = width
  }

  public get nodes() {
    let nodes: MazeNode[] = []

    for (let i = 0, j = -1; i < this.pixels.length; j = i++) {
      let pixel = this.pixels[i]
      let lastPixel = this.pixels[j]
      if (!pixel) continue

      let up = this.pixels[i - this.width]
      let down = this.pixels[i + this.width]
      let left = this.pixels[i - 1]
      let right = this.pixels[i + 1]

      if (left && down || !left && !down || !left && !up || left && up || up && down && right || !up && !down && !right) {
        nodes.push(new MazeNode(this.pixelPos(i)))
      }
    }

    return nodes
  }

  private nodeFromPos(pos: Vector, nodes: MazeNode[]) {
    for (let node of nodes) {
      if (node.pos.equals(pos)) return node
    }
  }

  private pixelPos(index: number) {
    return new Vector(
      index % this.width,
      Math.floor(index / this.width)
    )
  }

  private onPath(index: number) {
    
  }
}
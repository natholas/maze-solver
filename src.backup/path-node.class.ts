import { Vector } from './vector.class'
import { Neighbour } from './neighbour.class'

export class PathNode {
  neighbours: Neighbour[]
  pos: Vector
  constructor(pos: Vector) {
    this.pos = pos
  }
}

export class Vector {
  x: number
  y: number
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  add(pos: Vector) {
    return new Vector(
      this.x + pos.x,
      this.y + pos.y
    )
  }

  times(amount: number) {
    return new Vector(
      this.x * amount,
      this.y * amount
    )
  }

  dist(pos: Vector) {
    return Math.abs(this.x + pos.x) + Math.abs(this.y + pos.y)
  }

  equals(pos: Vector) {
    return pos.x == this.x && pos.y == this.y
  }
}
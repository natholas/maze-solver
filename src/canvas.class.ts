import * as functions from './functions'
import { Vector } from './vector.class'

export class Canvas {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor() {
    this.el = document.createElement('canvas')
    this.ctx = this.el.getContext('2d')
    document.body.appendChild(this.el)
  }

  public drawMaze(imgSrc: string) {
    return new Promise(resolve => {
      const image = new Image(60, 45);
      const t = this
      image.onload = function () {
        t.el.width = image.naturalWidth - 2;
        t.el.height = image.naturalHeight - 2;
        t.ctx.drawImage(image, -1, -1, image.naturalWidth, image.naturalHeight);
        resolve(t.processImgData(t.imageData.data))
      }
      image.src = imgSrc;
    })
  }

  public drawPositions(positions: Vector[]) {
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

  private get imageData() {
    return this.ctx.getImageData(0, 0, this.el.width, this.el.height)
  }

  private processImgData(rawImgData: Uint8ClampedArray) {
    let pixels = []
    for (var i = 0; i < rawImgData.length; i += 4) {
      pixels.push(!!rawImgData[i])
    }
    return pixels
  }
}
export function arrayCopy(array: any[]) {
  let output = []
  for (let x of array) {
    output.push(x)
  }
  return output
}

export function getRgb(percent: number) {
  return [
    Math.floor(2.55 * percent),
    0,
    255 - Math.floor(2.55 * percent)
  ]
}
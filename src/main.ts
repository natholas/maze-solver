import { Canvas } from './canvas.class'
import { Solver } from './solver.class'
import { Maze } from './maze.class'
import { MazeNode } from './maze-node.class'

let mazeLink: string = 'assets/maze_20_3.gif'

if (location.search.indexOf('maze=') > -1) {
  mazeLink = 'assets/' + location.search.split('maze=')[1] + '.gif'
}

const canvas = new Canvas()
let maze: Maze
const solver = new Solver()

canvas.drawMaze(mazeLink).then((data: boolean[]) => {
  maze = new Maze(data, canvas.el.width)
  canvas.drawPositions(maze.nodes.map((node: MazeNode) => {
    return node.pos
  }))


  let path: MazeNode[] = solver.solve(maze.nodes)
  canvas.drawPositions(path.map((node: MazeNode) => {
    return node.pos
  }))
})
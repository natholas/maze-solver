import { Canvas } from './canvas.class'

const maze = new Canvas()
maze.draw('assets/maze_20.gif', function() {
  maze.solve()
})
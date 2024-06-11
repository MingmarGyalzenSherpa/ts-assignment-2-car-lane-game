import { CarDimension } from "../constants/constants";
interface IObstacle {
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
}

export default class Obstacle implements IObstacle {
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D, x: number, y: number, dy = 0) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.width = CarDimension.WIDTH;
    this.height = CarDimension.HEIGHT;
    this.context = context;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "black";
  }
}

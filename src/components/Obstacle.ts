import { CanvasDimension } from "../constants/constants";
import getRandomInt from "../utils/utils";

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
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dy = 0,
    width: number,
    height: number
  ) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.context = context;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.closePath();
  }

  update() {
    this.y += this.dy;
    if (this.y > CanvasDimension.HEIGHT) {
      this.y = getRandomInt(-200, 0);
    }
  }
}

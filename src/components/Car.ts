import { Direction } from "./../constants/enums";
import { CarDimension } from "../constants/constants";
interface ICar {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  curLane: number;
}

export default class Car implements ICar {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  curLane: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    curLane: number
  ) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.curLane = curLane;
    //add event listener for y-axis movement
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "blue";
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.closePath();
  }

  move(direction: Direction, offsetX: number) {
    switch (direction) {
      case Direction.Left:
        this.x -= offsetX;
        break;

      case Direction.Right:
        this.x += offsetX;
        break;
    }
  }
}

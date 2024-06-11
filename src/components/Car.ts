import { Direction } from "./../constants/enums";
import { CarDimension } from "../constants/constants";
interface ICar {
  x: number;
  y: number;
  dx: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  curLane: number;
  direction?: Direction;
  targetX?: number;
}

export default class Car implements ICar {
  x: number;
  y: number;
  dx: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  curLane: number;
  direction?: Direction;
  targetX?: number;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    width: number,
    height: number,
    curLane: number
  ) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.dx = dx;
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

  setDirectionAndTarget(direction: Direction, targetX: number) {
    this.direction = direction;
    this.targetX = targetX;
  }

  update() {
    if (this.targetX === undefined) return;
    const directionVector = this.direction == Direction.Left ? -1 : 1;
    this.x += directionVector * this.dx;
    if (
      (this.direction === Direction.Left && this.x <= this.targetX) ||
      (this.direction === Direction.Right && this.x >= this.targetX)
    ) {
      this.x = this.targetX;
      this.targetX = undefined;
    }
  }
}

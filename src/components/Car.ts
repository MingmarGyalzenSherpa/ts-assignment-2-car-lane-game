import { Direction } from "./../constants/enums";
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
  img: CanvasImageSource;
  ammo: number;
  isImgLoaded?: boolean;
  score: number;
  crashed: boolean;
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
  img: CanvasImageSource;
  isImgLoaded?: boolean;
  ammo: number;
  score: number;
  crashed: boolean;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    width: number,
    height: number,
    curLane: number,
    img: CanvasImageSource
  ) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.width = width;
    this.height = height;
    this.context = context;
    this.curLane = curLane;
    this.img = img;
    this.ammo = 20;
    this.score = 0;
    this.crashed = false;
    //add event listener for y-axis movement
  }

  draw() {
    //draw car image
    if (this.crashed) return;
    this.context.beginPath();
    this.context.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.context.closePath();
  }
  setDirectionAndTarget(direction: Direction, targetX: number) {
    this.direction = direction;
    this.targetX = targetX;
  }

  update() {
    if (this.targetX === undefined || this.crashed) return;
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

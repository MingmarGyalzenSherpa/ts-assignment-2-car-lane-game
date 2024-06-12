import { clamp } from "../utils/utils";

interface ITile {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  maxSpeed: number;
  minSpeed: number;
}

export default class Tile implements ITile {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  boundaryHeight: number;
  maxSpeed: number;
  minSpeed: number;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    dy: number,
    acceleration: number,
    boundaryHeight: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = dy;
    this.maxSpeed = 15;
    this.minSpeed = 1;
    this.acceleration = acceleration;
    this.context = context;
    this.boundaryHeight = boundaryHeight;
  }

  update() {
    this.y += this.dy;
    this.dy = clamp(
      this.dy + this.dy * this.acceleration,
      this.minSpeed,
      this.maxSpeed
    );
    if (this.y > this.boundaryHeight) {
      this.y = -this.height;
    }
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "white";
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.closePath();
  }
}

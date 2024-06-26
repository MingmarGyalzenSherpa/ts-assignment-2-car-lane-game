import ammoImage from "../assets/sprites/ammo.png";
import { clamp } from "../utils/utils";

interface IAmmo {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  minSpeed: number;
  maxSpeed: number;
  img: CanvasImageSource;
  context: CanvasRenderingContext2D;
}
export default class Ammo implements IAmmo {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  minSpeed: number;
  maxSpeed: number;

  img: CanvasImageSource;
  context: CanvasRenderingContext2D;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dy: number,
    acceleration: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.acceleration = acceleration;
    this.minSpeed = 1;
    this.maxSpeed = 15;
    this.img = new Image();
    this.img.src = ammoImage;
  }

  draw() {
    this.context.beginPath();
    this.context.drawImage(this.img, this.x, this.y, 80, 80);
    this.context.closePath();
  }

  update() {
    this.y += this.dy;
    this.dy += clamp(
      this.dy + this.dy * this.acceleration,
      this.minSpeed,
      this.maxSpeed
    );
  }
}

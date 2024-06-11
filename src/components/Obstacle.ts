import { CanvasDimension } from "../constants/constants";
import { clamp, getRandomInt } from "../utils/utils";
interface IObstacle {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  maxSpeed: number;
  minSpeed: number;
  image: CanvasImageSource;
  maxLane: number;
  widthPerLane: number;
  objectHorizontalMargin: number;
  hpLine: number;
}

export default class Obstacle implements IObstacle {
  x: number;
  y: number;
  dy: number;
  acceleration: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  maxSpeed: number;
  minSpeed: number;
  image: CanvasImageSource;
  maxLane: number;
  widthPerLane: number;
  objectHorizontalMargin: number;
  hpLine: number;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dy = 0,
    acceleration: number,
    width: number,
    height: number,
    img: CanvasImageSource,
    totalLane: number,
    widthPerLane: number,
    objectHorizontalMargin: number
  ) {
    //initialize properties
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.acceleration = acceleration;
    this.width = width;
    this.height = height;
    this.context = context;
    this.maxSpeed = 15;
    this.minSpeed = 1;
    this.hpLine = 3;
    this.image = img;
    this.maxLane = totalLane;
    this.widthPerLane = widthPerLane;
    this.objectHorizontalMargin = objectHorizontalMargin;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "yellow";
    // this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);

    this.context.closePath();
  }

  update(obstacles: Obstacle[]): boolean {
    let hasPassedBoundary = false;
    this.y += this.dy;
    this.dy = clamp(
      this.dy + this.dy * this.acceleration,
      this.minSpeed,
      this.maxSpeed
    );
    if (this.y > CanvasDimension.HEIGHT) {
      this.x =
        getRandomInt(0, this.maxLane) * this.widthPerLane +
        this.objectHorizontalMargin;
      hasPassedBoundary = true;
      let maxY = 0;
      let range = 200;
      obstacles.forEach((obstacle) => {
        if (obstacle == this) return;
        if (obstacle.y < maxY) {
          maxY = obstacle.y;
        }
      });
      maxY = maxY - this.height - this.height;
      let minY = maxY - range;
      console.log("maxY = ", maxY - this.height - this.height);
      console.log("minY = ", minY);
      this.y = getRandomInt(minY, maxY);
      console.log("same y happening ", this.y);
    }
    return hasPassedBoundary;
  }
}

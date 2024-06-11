interface IBullet {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  dy: number;
  radius: number;
}
export default class Bullet implements IBullet {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  dy: number;
  radius: number;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dy: number,
    radius: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = "orange";
    this.context.fill();
    this.context.closePath();
  }

  update() {
    this.y -= this.dy;
  }
}

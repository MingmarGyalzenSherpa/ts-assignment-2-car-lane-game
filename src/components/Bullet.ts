import BulletImage from "../assets/sprites/bullet.png";
interface IBullet {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  image: CanvasImageSource;
}
export default class Bullet implements IBullet {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  image: CanvasImageSource;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dy: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.width = 15;
    this.height = 10;
    this.image = new Image();
    this.image.src = BulletImage;
  }

  draw() {
    this.context.beginPath();
    // this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    // this.context.fillStyle = "orange";
    // this.context.fill();
    this.context.closePath();
  }

  update() {
    this.y -= this.dy;
  }
}

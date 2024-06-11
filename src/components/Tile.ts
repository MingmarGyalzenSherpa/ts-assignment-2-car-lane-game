interface ITile {
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
}

export default class Tile implements ITile {
  x: number;
  y: number;
  dy: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  boundaryHeight: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    dy: number,
    boundaryHeight: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = dy;
    this.context = context;
    this.boundaryHeight = boundaryHeight;
  }

  update() {
    this.y += this.dy;
    if (this.y > this.boundaryHeight) {
      console.log("high");
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

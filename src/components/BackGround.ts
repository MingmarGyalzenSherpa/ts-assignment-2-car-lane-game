interface IBackground {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  bgColor: string;
}

export default class Background implements IBackground {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  bgColor: string;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.bgColor = "black";
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.closePath();
  }
}

import { Direction, GameState } from "./../constants/enums";
import Background from "./BackGround";
import Car from "./Car";
import Obstacle from "./Obstacle";
import Tile from "./Tile";

interface IGameManager {
  player?: Car;
  x: number;
  y: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  obstacles?: Obstacle[];
  score: number;
  gameState: GameState;
  background: Background;
  tiles?: Tile[];
  totalLane: number;
  speed: number;
  widthPerLane: number;
}

export default class GameManager implements IGameManager {
  player?: Car;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  score: number;
  gameState: GameState;
  x: number;
  y: number;
  background: Background;
  tiles?: Tile[];
  totalLane: number;
  speed: number;
  widthPerLane: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.score = 0;
    this.totalLane = 3;
    this.widthPerLane = this.width / this.totalLane;
    this.gameState = GameState.Waiting;
    this.background = new Background(
      this.context,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.speed = 1;
    this.setupTiles();
    this.setupPlayer();
    //add event listener for play on space press
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.gameState === GameState.Waiting) {
        this.gameState = GameState.Running;
      }

      switch (e.code) {
        case "ArrowLeft":
          if (this.player?.curLane === 1) break;
          this.player?.move(Direction.Left, this.widthPerLane);
          break;
        case "ArrowRight":
          if (this.player?.curLane === this.totalLane) break;
          this.player?.move(Direction.Right, this.widthPerLane);
          break;
      }
    });
    requestAnimationFrame(this.start);
  }

  setupTiles = () => {
    this.tiles = [];
    //calculate width of each lane
    let widthPerLane: number = this.width / this.totalLane;
    let tileVerticalGap: number = 100;
    //set tile height to 10% of total game height
    let tileHeight: number = (10 / 100) * this.height;
    //set tile width to 3% of total game width;
    let tileWidth: number = (3 / 100) * this.width;

    //offset the tile x by half its width
    let offsetX: number = tileWidth / 2;
    for (let i = 1; i < this.totalLane; i++) {
      //number of vertical tiles is based on height,if 600 then 6 tiles

      for (let j = 0; j < this.height / 100; j++) {
        this.tiles?.push(
          new Tile(
            this.context,
            i * widthPerLane - offsetX,
            j * tileVerticalGap,
            tileWidth,
            tileHeight,
            this.speed,
            this.height
          )
        );
      }
    }
  };

  //setup player
  setupPlayer = () => {
    //the horizontal gap the car should maintain on left and right side in a lane
    let gap: number = 30;
    //width of player should be less than width of lane
    let playerWidth: number = this.widthPerLane - gap * 2;
    //initially player should be in 2 lane
    let playerX: number = this.widthPerLane + gap;

    //width and height should be in aspect ratio 1/1
    let playerHeight: number = playerWidth;

    //player should be 10 pixel above the bottom boundary
    let offsetY = 10;
    let playerY = this.height - playerHeight - offsetY;
    console.log({ gap, playerWidth, playerX, playerHeight });
    this.player = new Car(
      this.context,
      playerX,
      playerY,
      playerWidth,
      playerHeight,
      2
    );
  };
  start = () => {
    this.draw();
    this.update();
    requestAnimationFrame(this.start);
  };

  update = () => {
    if (this.gameState !== GameState.Running) return;
    //move tiles
    this.tiles?.forEach((tile) => {
      tile.update();
    });
  };

  draw = () => {
    this.context.clearRect(this.x, this.y, this.width, this.height);

    //draw background
    this.background.draw();

    switch (this.gameState) {
      case GameState.Waiting: {
        this.waitingStateRender();
        break;
      }
      case GameState.Running: {
        this.runningStateRender();
        break;
      }
      case GameState.End: {
        break;
      }
    }
  };

  waitingStateRender() {
    this.context.font = "20px sans-serif";
    this.context.strokeStyle = "white";
    this.context.strokeText(
      "WELCOME TO CAR LANE GAME",
      this.widthPerLane / 2,
      this.height / 2
    );
    this.context.strokeText(
      "Press SPACE to start",
      this.widthPerLane / 2 + 50,
      this.height / 2 + 50
    );
  }

  runningStateRender() {
    //draw tiles
    this.tiles?.forEach((tile) => {
      tile.draw();
    });

    //draw player
    this.player?.draw();
  }
}

import getRandomInt from "../utils/utils";
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
  objectHorizontalMargin: number;
  objectWidth: number;
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
  obstacles?: Obstacle[];
  background: Background;
  tiles?: Tile[];
  totalLane: number;
  speed: number;
  widthPerLane: number;
  objectHorizontalMargin: number;
  objectWidth: number;
  constructor(canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.obstacles = [];
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
    this.objectHorizontalMargin = 30; //represents the margin left and right of object  inside a lane
    this.objectWidth = this.widthPerLane - this.objectHorizontalMargin * 2;
    this.speed = 1;
    this.setupTiles();
    this.setupPlayer();
    this.setupObstacles();
    //add event listener for play on space press
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.gameState === GameState.Waiting) {
        this.gameState = GameState.Running;
      }

      switch (e.code) {
        case "ArrowLeft":
          console.log(this.player?.targetX);
          //if player has its target x, it means its moving
          if (this.player?.curLane === 1 || this.player?.targetX) break;

          this.player?.setDirectionAndTarget(
            Direction.Left,
            this.player.x - this.widthPerLane
          );
          break;
        case "ArrowRight":
          //if player has its target x, it means its moving
          if (this.player?.curLane === this.totalLane || this.player?.targetX)
            break;
          this.player?.setDirectionAndTarget(
            Direction.Right,
            this.player.x + this.widthPerLane
          );
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

    //initially player should be in 2 lane
    let playerX: number = this.widthPerLane + this.objectHorizontalMargin;

    //width and height should be in aspect ratio 1/1
    let playerHeight: number = this.objectWidth;

    //player should be 10 pixel above the bottom boundary
    let offsetY = 10;
    let playerDx = 5;
    let playerY = this.height - playerHeight - offsetY;
    this.player = new Car(
      this.context,
      playerX,
      playerY,
      playerDx,
      this.objectWidth,
      playerHeight,
      2
    );
  };

  setupObstacles = () => {
    //obstacles should be equal to total lane
    let x: number;

    //width and height of obstacle are same
    let obstacleHeight: number = this.objectWidth;
    let gap = obstacleHeight;
    let obstacleMinY: number = -200;
    let obstacleMaxY: number = 0;
    for (let i = 0; i < this.totalLane; i++) {
      x = i * this.widthPerLane + this.objectHorizontalMargin;
      this.obstacles?.push(
        new Obstacle(
          this.context,
          x,
          getRandomInt(obstacleMinY, obstacleMaxY),
          1,
          this.objectWidth,
          obstacleHeight
        )
      );
      obstacleMaxY = obstacleMinY - gap;
      obstacleMinY = 2 * obstacleMinY;
      console.log({ obstacleMinY, obstacleMaxY });
    }
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

    //update player
    this.player?.update();

    //update obstacle
    this.obstacles?.forEach((obstacle) => {
      obstacle.update();
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

    //draw obstacles
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw();
    });
  }
}

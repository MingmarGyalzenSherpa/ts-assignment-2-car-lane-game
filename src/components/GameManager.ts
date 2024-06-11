import {
  collisionDetection,
  getRandomInt,
  randomObstacleImageGenerator,
} from "../utils/utils";
import { Direction, GameState } from "./../constants/enums";
import Background from "./BackGround";
import Car from "./Car";
import Obstacle from "./Obstacle";
import Tile from "./Tile";
import Bullet from "./Bullet";
import playerCar from "../assets/sprites/player-car.png";
interface IGameManager {
  player?: Car;
  bullets: Bullet[];
  ammo: number;
  x: number;
  y: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  obstacles: Obstacle[];
  score: number;
  gameState: GameState;
  background: Background;
  tiles?: Tile[];
  totalLane: number;
  speed: number;
  acceleration: number;
  widthPerLane: number;
  objectHorizontalMargin: number;
  objectWidth: number;
  hasPassedBoundary: boolean;
}

export default class GameManager implements IGameManager {
  player?: Car;
  bullets: Bullet[];
  ammo: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  score: number;
  gameState: GameState;
  x: number;
  y: number;
  obstacles: Obstacle[];
  background: Background;
  tiles?: Tile[];
  totalLane: number;
  speed: number;
  acceleration: number;
  widthPerLane: number;
  objectHorizontalMargin: number;
  objectWidth: number;
  hasPassedBoundary: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.ammo = 20;
    this.bullets = [];
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;

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
    this.obstacles = [];
    this.score = 0;
    this.hasPassedBoundary = false;
    this.objectHorizontalMargin = 40; //represents the margin left and right of object  inside a lane
    this.objectWidth = this.widthPerLane - this.objectHorizontalMargin * 2;
    this.speed = 10;
    this.acceleration = 0.0001;
    this.setupTiles();
    this.setupPlayer();
    this.setupObstacles();

    //add event listener for play on space press
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (this.gameState === GameState.Waiting) {
          this.gameState = GameState.Running;
        } else if (this.gameState === GameState.End) {
          this.playAgainSetup();
          this.gameState = GameState.Running;
        }
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

  playAgainSetup() {
    this.obstacles = [];
    this.score = 0;
    this.objectHorizontalMargin = 30; //represents the margin left and right of object  inside a lane
    this.objectWidth = this.widthPerLane - this.objectHorizontalMargin * 2;
    this.speed = 10;
    this.setupTiles();
    this.setupPlayer();
    this.setupObstacles();
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
            this.acceleration,
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

    //width and height should be in aspect ratio 1/1.5
    let playerHeight: number = this.objectWidth * 1.5;

    //player should be 10 pixel above the bottom boundary
    let offsetY = 10;
    let playerDx = 10;
    let playerY = this.height - playerHeight - offsetY;
    let image = new Image();
    image.src = playerCar;
    console.log("Image width ", image.width);
    console.log(this.objectWidth);
    this.player = new Car(
      this.context,
      playerX,
      playerY,
      playerDx,
      this.objectWidth,
      playerHeight,
      2,
      image
    );
  };

  setupObstacles = () => {
    //obstacles should be equal to total lane
    let x: number;

    //width and height of obstacle are in 1/2 aspect ratio
    let obstacleHeight: number = this.objectWidth * 2;
    let gap = obstacleHeight;
    let obstacleMinY: number = -200;
    let obstacleMaxY: number = 0;
    let image;
    for (let i = 0; i < this.totalLane; i++) {
      x = i * this.widthPerLane + this.objectHorizontalMargin;
      console.log({ x });
      image = randomObstacleImageGenerator();
      this.obstacles?.push(
        new Obstacle(
          this.context,
          x,
          getRandomInt(obstacleMinY, obstacleMaxY),
          this.speed,
          this.acceleration,
          this.objectWidth,
          obstacleHeight,
          image,
          this.totalLane,
          this.widthPerLane,
          this.objectHorizontalMargin
        )
      );
      console.log({ obstacleMinY, obstacleMaxY });

      obstacleMaxY = obstacleMinY - obstacleHeight - gap;
      obstacleMinY = obstacleMaxY - obstacleHeight;
    }
  };

  start = () => {
    console.log("hey");
    this.update();
    this.draw();
    this.collisionDetection();
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

    //update bullet
    this.bullets.forEach((bullet) => bullet.update());

    //update obstacle
    this.obstacles?.forEach((obstacle) => {
      this.hasPassedBoundary = obstacle.update(this.obstacles);
      if (this.hasPassedBoundary) this.score++;
      this.hasPassedBoundary = false;
    });
  };

  collisionDetection = () => {
    if (this.gameState !== GameState.Running) return;
    //collision between obstacle and player car
    let collided = false;
    for (let i = 0; i < this.obstacles?.length; i++) {
      if (collisionDetection(this.player!, this.obstacles[i])) {
        collided = true;
        console.log("oops");
        break;
      }
    }
    if (collided) this.gameState = GameState.End;

    //bullet collision
    this.bullets.forEach((bullet) => {
      this.obstacles.forEach((obstacle) => {
        if (obstacle.x < bullet.x && obstacle.x + obstacle.width > bullet.x) {
          
        }
      });
    });
  };

  draw = () => {
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
        this.gameEndStateRender();
        break;
      }
    }
  };

  waitingStateRender() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
    //draw background
    this.background.draw();

    // draw text
    this.context.font = "20px sans-serif";
    this.context.fillStyle = "white";
    this.context.fillText(
      "WELCOME TO CAR LANE GAME",
      this.widthPerLane / 2,
      this.height / 2
    );
    this.context.fillText(
      "Press SPACE to start",
      this.widthPerLane / 2 + 50,
      this.height / 2 + 50
    );
  }

  runningStateRender() {
    this.context.clearRect(this.x, this.y, this.width, this.height);

    //draw background
    this.background.draw();

    //draw tiles
    this.tiles?.forEach((tile) => {
      tile.draw();
    });

    //draw player
    this.player?.draw();

    //draw bullet
    this.bullets.forEach((bullet) => {
      bullet.draw();
    });

    //draw obstacles
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw();
    });
    this.drawScore();
  }

  drawScore() {
    let scoreText: string = `Score: ${this.score}`;
    this.context.beginPath();
    this.context.font = "bold 18px sans-serif";
    this.context.fillStyle = "green";
    this.context.fillText(scoreText, this.width - 100, this.y + 30);
    this.context.closePath();
  }

  gameEndStateRender() {
    this.context.beginPath();
    this.context.font = "bold 30px sans-serif";
    this.context.fillStyle = "red";
    this.context.fillText("GAME OVER!!", this.width / 4, this.height / 2);
    this.context.font = "20px sans-serif";
    this.context.fillText(
      "Press SPACE to play again",
      this.width / 5,
      this.height / 2 + 50
    );
  }
}

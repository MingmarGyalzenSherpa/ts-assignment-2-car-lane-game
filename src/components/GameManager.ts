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
import playerCar1 from "../assets/sprites/player-car-1.png";
import playerCar2 from "../assets/sprites/player-car-2.png";

interface IGameManager {
  player?: Car;
  players?: Car[];
  winner?: number;
  bullets: Bullet[];
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
  players?: Car[];
  winner?: number;
  bullets: Bullet[];
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

  constructor(canvas: HTMLCanvasElement, totalLane: number) {
    this.x = 0;
    this.y = 0;
    this.bullets = [];
    this.players = [];
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.totalLane = totalLane;
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
    this.objectHorizontalMargin = 30; //represents the margin left and right of object  inside a lane
    this.objectWidth = this.widthPerLane - this.objectHorizontalMargin * 2;
    this.speed = 1;
    this.acceleration = 0.001;
    this.setupTiles();
    this.setupPlayer();
    this.setupObstacles();

    //add event listener for play on space press
    document.addEventListener("keydown", (e) => {
      console.log(e.code);
      if (e.code === "Escape") {
        if (this.gameState === GameState.Running) {
          console.log(this.gameState);
          this.gameState = GameState.Paused;
          return;
        }
        console.log(this.gameState);
        if (this.gameState === GameState.Paused) {
          this.gameState = GameState.Running;
          return;
        }
      }

      if (e.code === "Space") {
        if (this.gameState === GameState.Waiting) {
          this.gameState = GameState.Running;
        } else if (this.gameState === GameState.End) {
          this.playAgainSetup();
          this.gameState = GameState.Running;
        }
      }
      if (e.code === "CapsLock") {
        if (
          this.gameState !== GameState.Running ||
          !this.players![0].ammo ||
          this.players![0].crashed
        )
          return;
        console.log("shoot");
        this.players![0].ammo--;
        this.bullets.push(
          new Bullet(
            this.context,
            this.players![0].x + this.players![0].width * 0.5, //scaling factor = 2.5
            this.players![0].y,
            2
          )
        );
      }
      if (e.code === "KeyM") {
        if (
          this.gameState !== GameState.Running ||
          !this.players![1].ammo ||
          this.players![1].crashed
        )
          return;
        console.log("shoot");
        this.players![1].ammo--;
        this.bullets.push(
          new Bullet(
            this.context,
            this.players![1].x + this.players![1].width / 2,
            this.players![1].y,
            2,
            5
          )
        );
      }
      switch (e.code) {
        case "KeyA":
          //if player2 has its target x, it means its moving
          if (this.players![0].curLane === 1 || this.players![0].targetX) {
            break;
          }
          this.players![0].setDirectionAndTarget(
            Direction.Left,
            this.players![0].x - this.widthPerLane
          );
          this.players![0].curLane--;
          break;

        case "KeyD":
          //if player1 has its target x, it means its moving
          console.log("cur Lane player 1 " + this.players![0].curLane);
          if (
            this.players![0].curLane === this.totalLane ||
            this.players![0].targetX
          ) {
            break;
          }
          this.players![0].setDirectionAndTarget(
            Direction.Right,
            this.players![0].x + this.widthPerLane
          );
          this.players![0].curLane++;

          break;
      }
      switch (e.code) {
        case "ArrowLeft":
          //if player1 has its target x, it means its moving
          if (this.players![1].curLane === 1 || this.players![1].targetX) break;

          this.players![1].setDirectionAndTarget(
            Direction.Left,
            this.players![1].x - this.widthPerLane
          );
          this.players![1].curLane--;
          break;
        case "ArrowRight":
          //if player1 has its target x, it means its moving
          if (
            this.players![1].curLane === this.totalLane ||
            this.players![1].targetX
          ) {
            break;
          }
          this.players![1].setDirectionAndTarget(
            Direction.Right,
            this.players![1].x + this.widthPerLane
          );
          this.players![1].curLane++;
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
    this.speed = 1;
    this.acceleration = 0.001;
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
    //reset players array
    this.players = [];

    //width and height should be in aspect ratio 1/1.5
    let playerHeight: number = this.objectWidth * 1.5;

    //player should be 10 pixel above the bottom boundary
    let offsetY = 10;
    let playerDx = 10;
    let playerY = this.height - playerHeight - offsetY;
    let image1 = new Image();
    let image2 = new Image();
    image1.src = playerCar1;
    image2.src = playerCar2;
    console.log("Image width ", image1.width);
    console.log(this.objectWidth);

    for (let i = 0; i <= 1; i++) {
      this.players!.push(
        new Car(
          this.context,
          i * this.widthPerLane + this.objectHorizontalMargin,
          playerY,
          playerDx,
          this.objectWidth,
          playerHeight,
          i + 1,
          i === 0 ? image1 : image2
        )
      );
    }
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
    // this.player?.update();
    this.players?.forEach((player) => {
      player.update();
    });

    //update bullet
    this.bullets.forEach((bullet) => bullet.update());

    //update obstacle
    this.obstacles?.forEach((obstacle) => {
      this.hasPassedBoundary = obstacle.update(this.obstacles);
      if (this.hasPassedBoundary) {
        this.players?.forEach((player) => {
          if (!player.crashed) {
            player.score++;
          }
        });
      }
      this.hasPassedBoundary = false;
    });
  };

  collisionDetection = () => {
    if (this.gameState !== GameState.Running) return;

    for (let i = 0; i < this.players!.length; i++) {
      for (let j = 0; j < this.obstacles?.length; j++) {
        if (collisionDetection(this.players![i], this.obstacles[j])) {
          this.players![i].crashed = true;
          this.winner = i === 0 ? 2 : 1;
          break;
        }
      }
    }
    if (this.players![0].crashed && this.players![1].crashed)
      this.gameState = GameState.End;

    //bullet collision
    this.bullets.forEach((bullet) => {
      this.obstacles.forEach((obstacle) => {
        //check if same lane or if obstacle is being reLocated
        if (
          !(obstacle.x < bullet.x && obstacle.x + obstacle.width > bullet.x) ||
          obstacle.y < this.y
        ) {
          return;
        }
        //check if collided
        if (bullet.y <= obstacle.y + obstacle.height) {
          bullet.y = this.y;
          console.log("hit");
          obstacle.hpLine--;
          if (obstacle.hpLine === 0) {
            obstacle.y = this.height;
          }
        }
      });
    });

    //filter the bullet
    this.bullets = this.bullets.filter((bullet) => bullet.y > this.y);
  };

  draw = () => {
    console.log("inside switch case");
    console.log(this.gameState);
    switch (this.gameState) {
      case GameState.Waiting: {
        this.waitingStateRender();
        break;
      }
      case GameState.Running: {
        this.runningStateRender();
        break;
      }

      case GameState.Paused: {
        console.log("heere");
        this.pausedStateRender();
        break;
      }
      case GameState.End: {
        this.gameEndStateRender();
        break;
      }
    }
  };

  pausedStateRender() {
    console.log("paused");
    this.context.clearRect(this.x, this.y, this.width, this.height);
    this.background.draw();
    this.context.beginPath();
    this.context.fillStyle = "white";
    this.context.fillText(
      "Press ESC to continue",
      this.width / 4,
      this.height / 2
    );
    this.context.closePath();
  }

  waitingStateRender() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
    //draw background
    this.background.draw();

    // draw text
    this.context.font = "20px sans-serif";
    this.context.fillStyle = "white";
    this.context.fillText(
      "WELCOME TO CAR LANE GAME",
      this.widthPerLane / 3,
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
    this.players?.forEach((player) => {
      player.draw();
    });

    //draw bullet
    this.bullets.forEach((bullet) => {
      bullet.draw();
    });

    //draw obstacles
    this.obstacles?.forEach((obstacle) => {
      obstacle.draw();
    });

    //draw score
    this.drawScore();

    //draw ammo
    this.drawAmmo();
  }

  drawScore() {
    //player 1
    let player1ScoreText: string = `Score: ${this.players![0].score}`;
    let player2ScoreText: string = `Score: ${this.players![1].score}`;

    this.context.beginPath();
    this.context.font = "bold 18px sans-serif";
    this.context.fillStyle = "green";
    this.context.fillText(player1ScoreText, this.x + 10, this.y + 20);
    this.context.fillText(player2ScoreText, this.width - 100, this.y + 20);
    this.context.closePath();
  }

  drawAmmo() {
    let player1OffsetX = 10;
    let player2OffsetX = -100;
    let playersOffsetY = 50;
    let player1AmmoText: string = `Ammo: ${this.players![0].ammo}`;
    let player2AmmoText: string = `Ammo: ${this.players![1].ammo}`;
    this.context.beginPath();
    this.context.font = "bold 18px sans-serif";
    this.context.fillStyle = "yellow";
    this.context.fillText(
      player1AmmoText,
      this.x + player1OffsetX,
      this.y + playersOffsetY
    );
    this.context.fillText(
      player2AmmoText,
      this.width + player2OffsetX,
      this.y + playersOffsetY
    );
    this.context.closePath();
  }

  gameEndStateRender() {
    this.context.beginPath();
    this.context.font = "bold 20px sans-serif";
    this.context.fillStyle = "red";
    this.context.fillText(`GAME OVER!!`, this.width / 3, this.height / 2.5);
    this.context.fillText(
      `Player ${this.winner} WON!! Congrats`,
      this.width / 5,
      this.height / 2
    );
    this.context.font = "20px sans-serif";
    this.context.fillText(
      "Press SPACE to play again",
      this.width / 5,
      this.height / 2 + 50
    );
  }
}

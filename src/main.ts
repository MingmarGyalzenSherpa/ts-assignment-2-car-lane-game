import GameManager from "./components/GameManager";
import { CanvasDimension } from "./constants/constants";

//get the canvas element;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

//set canvas property
canvas.width = CanvasDimension.WIDTH;
canvas.height = CanvasDimension.HEIGHT;

const gameManager: GameManager = new GameManager(canvas);

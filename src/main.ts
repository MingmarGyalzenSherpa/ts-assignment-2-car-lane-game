import GameManager from "./components/GameManager";
import { CanvasDimension } from "./constants/constants";

//get the canvas element;
const canvas1 = document.querySelector<HTMLCanvasElement>("#canvas1")!;

//set canvas property
canvas1.width = CanvasDimension.WIDTH;
canvas1.height = CanvasDimension.HEIGHT;

new GameManager(canvas1, 3);

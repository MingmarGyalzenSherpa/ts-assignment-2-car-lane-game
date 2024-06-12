import Car from "../components/Car";
import Obstacle from "../components/Obstacle";
import obstacle1 from "../assets/sprites/obstacle-1.png";
import obstacle2 from "../assets/sprites/obstacle-2.png";
import obstacle4 from "../assets/sprites/obstacle-4.png";

export function getRandomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}

export function collisionDetection(player: Car, obstacle: Obstacle): boolean {
  if (
    obstacle.x + obstacle.width >= player.x &&
    obstacle.x <= player.x + player.width &&
    obstacle.y + obstacle.height >= player.y &&
    obstacle.y <= player.y + player.height
  ) {
    return true;
  }
  return false;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomObstacleImageGenerator(): HTMLImageElement {
  const obstacles = [obstacle1, obstacle2, obstacle4];
  const obstacleImages = obstacles.map((obstacle) => {
    let image = new Image();
    image.src = obstacle;
    return image;
  });
  let randIndex = Math.floor(Math.random() * obstacles.length);
  return obstacleImages[randIndex];
}

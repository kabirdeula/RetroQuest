import { resources } from "./Resources";
import { Sprites } from "./Sprites";
import "./style.css";

const canvas = document.querySelector("#game-canvas") as HTMLCanvasElement;

const ctx = canvas?.getContext("2d");

const draw = () => {
  const sky = resources.images.sky;
  if (sky.isLoaded) {
    ctx?.drawImage(sky.image, 0, 0);
  }

  const ground = resources.images.ground;
  if (ground.isLoaded) {
    ctx?.drawImage(ground.image, 0, 0);
  }
};

const hero = new Sprites({
  resource: resources.images.hero.image,
  hFrames: 3,
  vFrames: 8,
  frame: 1,
});

setInterval(() => {
  draw();
}, 300);

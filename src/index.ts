import { Application, Loader, Sprite } from "pixi.js";
import mePng from "../images/me.png";
const elm: HTMLElement | null = document.getElementById("app");
const app = new Application();
if (elm) {
  elm.appendChild(app.view);
}
const loader = new Loader();
loader.add("me", mePng).load((_, resources) => {
  const meTexture = resources.me?.texture;
  if (!meTexture) {
    throw new Error("error");
  }
  const me = new Sprite(meTexture);
  me.x = app.renderer.width / 2;
  me.y = app.renderer.height / 2;
  app.stage.addChild(me);
  me.anchor.x = 0.5;
  me.anchor.y = 0.5;
  app.ticker.add(() => {
    me.rotation += 0.1;
  });
});

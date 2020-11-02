import { Application, Container, Graphics } from "pixi.js";

import { AppStore, Move, Player } from "../store";
import { fn, Point } from "./fn";
const elm: HTMLElement | null = document.getElementById("app");
const app = new Application({
  width: 800,
  height: 800,
});
if (elm) {
  elm.appendChild(app.view);
}
const LENGTH = 20;

const createInteractionLayer = (cb: (p: Point[]) => void) => {
  let touching: false | Point[] = false;
  const container = new Container();
  container.addListener("pointerout", () => {
    touching = false;
  });
  container.zIndex = 1000;
  for (let x = 0; x < LENGTH; x++) {
    for (let y = 0; y < LENGTH; y++) {
      const border = new Graphics()
        .lineStyle(5, 0x000066, 1)
        .drawRect(UNIT_SIZE * x, UNIT_SIZE * y, UNIT_SIZE, UNIT_SIZE);
      const area = new Graphics()
        .beginFill(0, 1)
        .drawRect(UNIT_SIZE * x, UNIT_SIZE * y, UNIT_SIZE, UNIT_SIZE)
        .endFill();
      container.addChild(area);
      container.addChild(border);
      area.interactive = true;
      area.addListener("pointerdown", () => {
        console.log("pointerdown", { x, y });
        touching = [{ x, y }];
      });
      area.addListener("pointerup", () => {
        console.log("pointerup", { x, y });
        touching && cb(touching);
        touching = false;
      });
      area.addListener("pointerover", () => {
        if (touching) {
          touching = fn(touching, { x, y });
        }
      });
      container.addChild(area);
    }
  }
  return container;
};

const UNIT_SIZE = 40;

export const connectStoreToPIXI = (store: AppStore): void => {
  const units = new Map<string, UnitView>();
  app.stage.addChild(createInteractionLayer(console.log));

  const createUnit = ({ name, x, y, color }: Player) => {
    const container = new Container();
    units.set(name, new UnitView(container));
    container.x = x * UNIT_SIZE;
    container.y = y * UNIT_SIZE;
    const unit = new Graphics()
      .beginFill(color)
      .drawRect(0, 0, UNIT_SIZE, UNIT_SIZE)
      .endFill();
    container.addChild(unit);
    app.stage.addChild(container);
    return container;
  };

  const applyHandler = (id: string, container: Container) => {
    const createHandler = (move: Move) => {
      const handler = new Graphics()
        .beginFill(0x2f2f2f)
        .drawRect(UNIT_SIZE * move.x, UNIT_SIZE * move.y, UNIT_SIZE, UNIT_SIZE)
        .endFill()
        .addListener("pointerdown", () => {
          store.publish("MOVE_ME", move);
        });
      handler.interactive = true;
      return handler;
    };
    container.addChild(createHandler({ id, x: -1, y: 0 }));
    container.addChild(createHandler({ id, x: 1, y: 0 }));
    container.addChild(createHandler({ id, x: 0, y: -1 }));
    container.addChild(createHandler({ id, x: 0, y: 1 }));
  };

  store.subscribe("ADD_ME", (player) => {
    applyHandler(player.name, createUnit(player));
  });
  store.subscribe("ADD_PLAYER", createUnit);
  store.subscribe("MOVE_ME", (move) => {
    units.get(move.id)?.move(move);
  });
  store.subscribe("MOVE_PLAYER", (move) => {
    units.get(move.id)?.move(move);
  });
};

class UnitView {
  private moving = false;
  constructor(private container: Container) {}

  move(move: Move) {
    this.container.x += UNIT_SIZE * move.x;
    this.container.y += UNIT_SIZE * move.y;
  }
}

import { createMultiKeyMap } from "@/libs/multikeymap";
import { Application, Container, Graphics } from "pixi.js";

import { AppStore, Move, Player } from "../store";
import { createInteractionStore, Point } from "./fn";
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
  const store = createInteractionStore();
  const map = createMultiKeyMap<[number, number], Graphics>();
  const container = new Container();
  container.addListener("mouseout", () => store.publish("RESET", undefined));
  container.zIndex = 1000;
  container.interactive = true;
  store.subscribe("RESULTED", cb);
  store.subscribe("SELECT", ({ x, y }) => {
    const area = map.get([x, y]);
    if (area) {
      const selected = new Graphics()
        .beginFill(0x000066, 0.8)
        .drawRect(UNIT_SIZE * x, UNIT_SIZE * y, UNIT_SIZE, UNIT_SIZE)
        .endFill();
      area.addChild(selected);
    }
  });
  store.subscribe("DESELECT", ({ x, y }) => {
    const area = map.get([x, y]);
    if (area) {
      area.removeChildren();
    }
  });
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
      area.addListener("pointerdown", () => store.publish("START", { x, y }));
      area.addListener("pointerup", () => store.publish("END", undefined));
      area.addListener("pointerover", () => store.publish("MOVE", { x, y }));
      map.set([x, y], area);
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

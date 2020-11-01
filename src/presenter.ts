import { Application, Container, Graphics } from "pixi.js";

import { AppStore, Move, Player } from "./store";
const elm: HTMLElement | null = document.getElementById("app");
const app = new Application({
  width: 800,
  height: 800,
});
if (elm) {
  elm.appendChild(app.view);
}

const UNIT_SIZE = 40;

export const connectStoreToPIXI = (store: AppStore): void => {
  const units = new Map<string, UnitView>();

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

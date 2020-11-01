import { Application, Graphics } from "pixi.js";
import { AppStore, Player } from "./store";
export const connectStoreToPIXI = (store: AppStore, app: Application): void => {
  const createUnit = ({ x, y, color }: Player) => {
    const unit = new Graphics()
      .beginFill(color)
      .drawRect(x * 10, y * 10, 10, 10)
      .endFill();
    app.stage.addChild(unit);
    return unit;
  };
  store.subscribe("ADD_ME", (player) => {
    createUnit(player);
  });
  store.subscribe("ADD_PLAYERS", (players) => {
    players.forEach(createUnit);
  });
};

import { AppStore, Player } from "./store";
const colors = [
  0xff0000,
  0xff007f,
  0xff00ff,
  0x7f00ff,
  0x0000ff,
  0x00ffff,
  0x00ff7f,
  0xffff00,
  0xff7f00,
];
const createNewPlayer = (name: string): Player => {
  return {
    x: Math.floor(Math.random() * 50),
    y: Math.floor(Math.random() * 50),
    color: colors[Math.floor(Math.random() * colors.length)],
    name,
  };
};
export const connectStoreToController = (store: AppStore): void => {
  store.subscribe("INIT", () => {
    const name = Math.floor(Math.random() * 100000).toString();
    const player: Player = createNewPlayer(name);
    store.publish("ADD_ME", player);
  });
};

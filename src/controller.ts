import { AppStore, Player } from "./store";
const createNewPlayer = (name: string): Player => {
  return {
    x: Math.floor(Math.random() * 50),
    y: Math.floor(Math.random() * 50),
    color:
      Math.floor(Math.random() * 200) +
      56 +
      (Math.floor(Math.random() * 200) + 56) * 256 +
      (Math.floor(Math.random() * 200) + 56) * 256,
    name,
  };
};
export const connectStoreToController = (store: AppStore): void => {
  store.subscribe("INIT", () => {
    const name = prompt("name?");
    if (name) {
      const player: Player = createNewPlayer(name);
      store.publish("ADD_ME", player);
    }
  });
};

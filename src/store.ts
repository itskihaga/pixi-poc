import { Reducers, Store } from "./libs/store";

export interface Player {
  x: number;
  y: number;
  color: number;
  name: string;
}
export interface AppState {
  players: Player[];
}
type AppActions = {
  ADD_ME: Player;
  ADD_PLAYERS: Player[];
  INIT: void;
};
export const reducers: Reducers<AppState, AppActions> = {
  ADD_ME: (prev, player) => ({ ...prev, players: [...prev.players, player] }),
  ADD_PLAYERS: (prev, players) => ({
    ...prev,
    players: [...prev.players, ...players],
  }),
};

export type AppStore = Store<AppState, AppActions>;

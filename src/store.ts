import { Reducers, Store } from "./libs/store";

export interface Player {
  x: number;
  y: number;
  color: number;
  name: string;
}

const movePlayers = (players: Player[], move: Move): Player[] => {
  return players.map((e) =>
    e.name == move.id ? { ...e, x: e.x + move.x, y: e.y + move.y } : e
  );
};

export interface Move {
  id: string;
  x: number;
  y: number;
}
export type AppState = {
  players: Player[];
};
type AppActions = {
  ADD_ME: Player;
  MOVE_ME: Move;
  MOVE_PLAYER: Move;
  ADD_PLAYER: Player;
  INIT: void;
};
export const reducers: Reducers<AppState, AppActions> = {
  ADD_ME: (prev, player) => ({ ...prev, players: [...prev.players, player] }),
  ADD_PLAYER: (prev, player) => ({
    ...prev,
    players: [...prev.players, player],
  }),
  MOVE_ME: (prev, move: Move) => ({
    ...prev,
    players: movePlayers(prev.players, move),
  }),
  MOVE_PLAYER: (prev, move) => ({
    ...prev,
    players: movePlayers(prev.players, move),
  }),
};

export type AppStore = Store<AppState, AppActions>;

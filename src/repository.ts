import { AppStore, Player } from "./store";
import firebase from "firebase/app";

export const connectStoreToFirestore = (
  store: AppStore,
  roomRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
): void => {
  const playersRef = roomRef.collection("players");
  store.subscribe("ADD_ME", (player) => playersRef.add(player));
  const addNewPlayers = (players: Player[]) => {
    const current = store.getState().players;
    const newPlayers = players.filter(
      (player) => !current.find((e) => e.name === player.name)
    );
    store.publish("ADD_PLAYERS", newPlayers);
  };
  store.subscribe("INIT", async () => {
    const data = await playersRef.get();
    const players = data.docs.map((p) => p.data() as Player); //FIXME io-ts
    addNewPlayers(players);
  });
  playersRef.onSnapshot((data) => {
    const players = data.docs.map((p) => p.data() as Player); //FIXME io-ts
    addNewPlayers(players);
  });
};

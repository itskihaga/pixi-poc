import { AppStore } from "./store";
import firebase from "firebase/app";

export const connectStoreToFirestore = (
  store: AppStore,
  roomRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
): void => {
  const actionsSet = new Set<string>();
  const actionsRef = roomRef.collection("actions");
  store.subscribe("INIT", () => actionsRef.get().then(update));
  store.subscribe("ADD_ME", (player) => {
    const actionRef = actionsRef.doc();
    actionsSet.add(actionRef.id);
    actionRef.set({
      type: "ADD_PLAYER",
      value: player,
      createdAt: new Date().getTime(),
    });
  });
  store.subscribe("MOVE_ME", (move) => {
    const actionRef = actionsRef.doc();
    actionsSet.add(actionRef.id);
    actionRef.set({
      type: "MOVE_PLAYER",
      value: move,
      createdAt: new Date().getTime(),
    });
  });

  const update = (
    data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) => {
    const filtered = data.docs.filter((e) => !actionsSet.has(e.id));
    filtered.sort((a, b) => a.data().createdAt - b.data().createdAt);
    filtered.forEach((actionData) => {
      const action = actionData.data();
      console.log(action);
      actionsSet.add(actionData.id);
      switch (action.type) {
        case "ADD_PLAYER":
          store.publish("ADD_PLAYER", action.value);
          break;
        case "MOVE_PLAYER":
          store.publish("MOVE_PLAYER", action.value);
          break;
        default:
          throw new Error("Unexpected " + action.type);
      }
    });
  };

  actionsRef.onSnapshot(update);
};

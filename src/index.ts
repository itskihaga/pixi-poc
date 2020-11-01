import firebase from "firebase/app";
import "firebase/firestore";
import { connectStoreToController } from "./controller";
import { createStore } from "./libs/store";
import { connectStoreToPIXI } from "./presenter";
import { connectStoreToFirestore } from "./repository";
import { reducers } from "./store";

firebase.initializeApp({
  apiKey: "AIzaSyAabuvSu6W3mebZOXbI9TVW59BLShbufU4",
  projectId: "momomo-game",
});
const db = firebase.firestore();
const roomsCol = db.collection("rooms");

const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");
const roomRef = roomId ? roomsCol.doc(roomId) : roomsCol.doc();
roomId || params.set("room", roomRef.id);
if (!roomId) {
  window.location.href = "?room=" + roomRef.id;
} else {
  const store = createStore(reducers, {
    players: [],
  });
  connectStoreToPIXI(store);
  connectStoreToController(store);
  connectStoreToFirestore(store, roomRef);

  store.publish("INIT", undefined);
}

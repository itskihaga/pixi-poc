import firebase from "firebase/app";
import "firebase/firestore";
import { Application } from "pixi.js";
import { connectStoreToController } from "./controller";
import { createStore } from "./libs/store";
import { connectStoreToPIXI } from "./presenter";
import { connectStoreToFirestore } from "./repository";
import { reducers } from "./store";
const elm: HTMLElement | null = document.getElementById("app");
const app = new Application({
  width: 500,
  height: 500,
});
if (elm) {
  elm.appendChild(app.view);
}
firebase.initializeApp({
  apiKey: "AIzaSyAabuvSu6W3mebZOXbI9TVW59BLShbufU4",
  projectId: "momomo-game",
});
const db = firebase.firestore();
const roomsCol = db.collection("rooms");

const roomId = new URLSearchParams(window.location.search).get("room");
console.log(roomId);
const roomRef = roomId ? roomsCol.doc(roomId) : roomsCol.doc();
console.log(roomRef.id);
const store = createStore(reducers, {
  players: [],
});
connectStoreToPIXI(store, app);
connectStoreToController(store);
connectStoreToFirestore(store, roomRef);

store.publish("INIT", undefined);

import firebase from "firebase";
import "firebase/firestore";
import { Application, Graphics, Container } from "pixi.js";
const elm: HTMLElement | null = document.getElementById("app");
const app = new Application({
  width: 500,
  height: 500,
});
if (elm) {
  elm.appendChild(app.view);
}

const addListener = (target: Container) => {
  window.addEventListener("keypress", (e) => {
    switch (e.key) {
      case "a":
        target.x = target.x - 10;
        break;
      case "d":
        target.x = target.x + 10;
        break;
      case "w":
        target.y = target.y - 10;
        break;
      case "x":
        target.y = target.y + 10;
        break;
    }
  });
};
interface Player {
  x: number;
  y: number;
  color: number;
  name: string;
}
const createUnit = ({ x, y, color }: Player) => {
  const unit = new Graphics()
    .beginFill(color)
    .drawEllipse(x * 10, y * 10, 10, 10)
    .endFill();
  app.stage.addChild(unit);
  return unit;
};

firebase.initializeApp({
  apiKey: "AIzaSyAabuvSu6W3mebZOXbI9TVW59BLShbufU4",
  projectId: "momomo-game",
});
const db = firebase.firestore();
const isNewGame = confirm("new room?");
const roomsCol = db.collection("rooms");

const playersMap = new Map<string, Player>();

const enterToRoom = (
  roomRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
) => {
  const name = prompt("name?");
  if (name) {
    const player: Player = {
      x: Math.floor(Math.random() * 50),
      y: Math.floor(Math.random() * 50),
      color:
        Math.floor(Math.random() * 256) +
        Math.floor(Math.random() * 256) * 256 +
        Math.floor(Math.random() * 256) * 256 * 256,
      name,
    };
    const unit = createUnit(player);
    addListener(unit);
    playersMap.set(name, player);
    roomRef
      .collection("players")
      .add({
        ...player,
      })
      .then(() => {
        roomRef.collection("players").onSnapshot((players) => {
          players.forEach((p) => {
            const data = p.data() as Player;
            if (!playersMap.has(data.name)) {
              playersMap.set(data.name, data);
              createUnit(data);
            }
          });
          console.log("update", players.size);
        });
      });
  }
};

if (isNewGame) {
  const roomRef = roomsCol.doc();
  console.log(roomRef.id);
  enterToRoom(roomRef);
} else {
  const roomid = prompt("room id?");
  if (roomid) {
    const roomRef = roomsCol.doc(roomid);
    roomRef
      .collection("players")
      .get()
      .then((players) => {
        console.log("room players ", players.size);
        if (players.size) {
          enterToRoom(roomRef);
        }
      });
  }
}

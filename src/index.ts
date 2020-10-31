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
firebase.initializeApp({
  apiKey: "AIzaSyAabuvSu6W3mebZOXbI9TVW59BLShbufU4",
  projectId: "momomo-game",
});
const db = firebase.firestore();
const isNewGame = confirm("new room?");
const roomsCol = db.collection("rooms");

interface PlayersRepository {
  addPlayer(player: Player): Promise<void>;
  fetchPlayers(): Promise<Player[]>;
  fetchPlayersSize(): Promise<number>;
  onOtherPlayerAdd(cb: (players: Player[]) => void): Promise<void>;
}
const createPlayersRepository = (
  roomRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
): PlayersRepository => {
  const playersRef = roomRef.collection("players");
  const playersMap = new Map<string, Player>();
  return {
    async addPlayer(player: Player): Promise<void> {
      playersMap.set(player.name, player);
      await playersRef.add(player);
    },
    async fetchPlayers(): Promise<Player[]> {
      const data = await playersRef.get();
      return data.docs.map((p) => p.data() as Player);
    },
    async fetchPlayersSize(): Promise<number> {
      const data = await playersRef.get();
      return data.size;
    },
    async onOtherPlayerAdd(cb: (players: Player[]) => void) {
      playersRef.onSnapshot((playersData) => {
        const newPlayers = playersData.docs
          .map((e) => e.data() as Player)
          .filter((player) => !playersMap.has(player.name));
        newPlayers.forEach((player) => {
          playersMap.set(player.name, player);
        });
        cb(newPlayers);
      });
    },
  };
};

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

const createNewPlayer = (name: string): Player => {
  return {
    x: Math.floor(Math.random() * 50),
    y: Math.floor(Math.random() * 50),
    color:
      Math.floor(Math.random() * 256) +
      Math.floor(Math.random() * 256) * 256 +
      Math.floor(Math.random() * 256) * 256 * 256,
    name,
  };
};

const playersMap = new Map<string, Player>();

const enterToRoom = (repo: PlayersRepository) => {
  const name = prompt("name?");
  if (name) {
    const player: Player = createNewPlayer(name);
    const unit = createUnit(player);
    addListener(unit);
    playersMap.set(name, player);
    repo.addPlayer(player);
    repo.onOtherPlayerAdd((players) => {
      players.forEach(createUnit);
    });
  }
};

if (isNewGame) {
  const roomRef = roomsCol.doc();
  const repo = createPlayersRepository(roomRef);
  console.log(roomRef.id);
  enterToRoom(repo);
} else {
  const roomid = prompt("room id?");
  if (roomid) {
    const roomRef = roomsCol.doc(roomid);
    const repo = createPlayersRepository(roomRef);
    repo.fetchPlayers().then((players) => {
      if (players.length) {
        enterToRoom(repo);
      }
    });
  }
}

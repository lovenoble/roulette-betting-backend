import { Client } from "colyseus.js";
import { useEffect } from "react";

let client = new Client("ws://localhost:3100");

const connectToRoom = async () => {
  const room = await client.joinOrCreate<any>("spin-game", {});

  room.state.batchEntries.onAdd = (data: any, key: any) => {
    console.log(data, key);
  };

  room.onStateChange((state) => {
    console.log(state.toJSON());
  });
  console.log(room);
};

function NewApp() {
  useEffect(() => {
    (async () => {
      await connectToRoom();
    })();
  }, []);

  return <h2>Something</h2>;
}

export default NewApp;

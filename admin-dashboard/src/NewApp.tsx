import { Client } from "colyseus.js";
import { useEffect } from "react";
import shortId from "shortid";
import { RecoilRoot, atom, useRecoilState } from "recoil";
import dayjs from "dayjs";

export const binaryDecoder = new TextDecoder("utf-8");
export const binaryEncoder = new TextEncoder();

let client = new Client("ws://localhost:3100");

// const ws = new WebSocket("ws://localhost:3100/ping");

// let clientId = "";
// let latestTimestamp = 0;

// ws.binaryType = "arraybuffer";

// ws.onopen = () => {
//   ws.send(
//     binaryEncoder.encode(
//       JSON.stringify({
//         message: "request uuid",
//       })
//     )
//   );
// };

// ws.onmessage = (message: any) => {
//   if (message.data) {
//     const decoded = binaryDecoder.decode(message.data);
//     const json = JSON.parse(decoded);

//     clientId = json.clientId;
//     latestTimestamp = json.timestamp;
//     console.log("Ping received", json);
//     const pingBack = {
//       clientId,
//       latestTimestamp,
//       newTimestamp: new Date().valueOf(),
//       isPingingBack: true,
//     };

//     ws.send(binaryEncoder.encode(JSON.stringify(pingBack)));
//   }
// };

// function requestNewPing() {
//   ws.send(
//     binaryEncoder.encode(
//       JSON.stringify({
//         message: "request uuid",
//         clientId,
//       })
//     )
//   );
// }

// setInterval(() => {
//   console.log("Requesting new ping");
//   requestNewPing();
// }, 5000);

// setInterval(() => {
//   const timestamp = new Date().valueOf();
//   const json = JSON.stringify({
//     latestTimestamp,
//     timestamp,
//     clientId,
//   });
//   console.log(json, timestamp);
//   ws.send(binaryEncoder.encode(json));
// }, 5000);

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNBZGRyZXNzIjoiMHhmMzlGZDZlNTFhYWQ4OEY2RjRjZTZhQjg4MjcyNzljZmZGYjkyMjY2Iiwibm9uY2UiOiIweDMxMzk2MzM1MzMzOTY1NjIyZDM0MzQzNTMyMmQzNDYzMzkzNzJkNjE2NTM1MzAyZDMxMzE2NjY0MzUzNzY2MzQzODMyMzc2NiIsImlhdCI6MTY1Mzk4NzgwMCwiZXhwIjoxNjU2NTc5ODAwfQ.72X95r_exGtJnyYPnMe__RLWiLNS0m8h5YpnSmqqHWI";

const connectToRoom = async (
  users: any,
  setUsers: any,
  guestUsers: any,
  setGuestUsers: any,
  timer: any,
  setTimer: any
) => {
  const room = await client.joinOrCreate<any>("Spin", {
    // authToken,
    guestId: shortId(),
  });

  // room.state.listen("timer", (curr: any, prev: any) => {
  //   console.log(curr, prev);
  // });

  // room.state.timer.onAdd = (timer: any) => {
  //   console.log(timer);
  // };

  // @ts-ignore
  room.onStateChange((args) => {
    console.log(args.batchEntries);
  });

  console.log(room.state);
  console.log(room.state.batchEntries);

  room.state.timer.onChange = (changes: any) => {
    //     const time = changes.filter((st: any) => {
    //         return st.field === "timeDisplay";
    //     })[0];

    //     if (time) {
    //         setTimer(time.value);
    //     }

    const time = changes.filter((st: any) => {
      return st.field === "elapsedTime";
    })[0];

    if (time) {
      setTimer(time.value.toString());
    }
  };
};

const userState = atom({
  key: "users",
  default: {},
});

const guestUserState = atom({
  key: "guestUsers",
  default: {},
});

const timerState = atom({
  key: "timer",
  default: "loading...",
});

function Room() {
  const [users, setUsers] = useRecoilState(userState);
  const [guestUsers, setGuestUsers] = useRecoilState(guestUserState);
  const [timer, setTimer] = useRecoilState(timerState);

  useEffect(() => {
    (async () => {
      await connectToRoom(
        users,
        setUsers,
        guestUsers,
        setGuestUsers,
        timer,
        setTimer
      );
    })();
  }, []);

  console.log(timer);

  return (
    <>
      <h2>SpinRoom - {timer}</h2>
    </>
  );
}

function NewApp() {
  return (
    <RecoilRoot>
      <Room />
    </RecoilRoot>
  );
}

export default NewApp;

import { Client } from "colyseus.js";
import { useEffect } from "react";
import shortId from "shortid";
import { RecoilRoot, atom, useRecoilState } from "recoil";
import dayjs from "dayjs";
import numeral from "numeral";

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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNBZGRyZXNzIjoiMHhmMzlGZDZlNTFhYWQ4OEY2RjRjZTZhQjg4MjcyNzljZmZGYjkyMjY2Iiwibm9uY2UiOiIweDMyNjIzMzMxMzc2MjY1MzUyZDM3MzM2MTMxMmQzNDYxMzM2MzJkNjEzOTY1MzMyZDM2Mzk2MjM4NjE2MjM0NjE2NTMzMzQzMiIsImlhdCI6MTY1NDQ4OTQ3OSwiZXhwIjoxNjU3MDgxNDc5fQ.8hQEPrd1x8lNYfQ5OFQHFsBHusZFZpTnU4oMdcCU_kw";

const connectToRoom = async (
  users: any,
  setUsers: any,
  guestUsers: any,
  setGuestUsers: any,
  timer: any,
  setTimer: any,
  setTotalSupply: any,
  setCurrentRoundId: any
) => {
  try {
    const room = await client.joinOrCreate<any>("Spin", {
      authToken,
      guestId: shortId(),
    });

    console.log(room);

    room.onError((code, message) => {
      console.log(code, message);
    });

    room.onLeave((code) => {
      console.log(code);
    });

    // room.state.listen("timer", (curr: any, prev: any) => {
    //   console.log(curr, prev);
    // });

    // room.state.timer.onAdd = (timer: any) => {
    //   console.log(timer);
    // };

    room.onStateChange((state) => {
      setTotalSupply(numeral(state.fareTotalSupply).format("0,0.00"));
      setCurrentRoundId(state.currentRoundId);
    });

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
  } catch (e: any) {
    console.log(e);
  }
};

const userState = atom({
  key: "users",
  default: {},
});

const guestUserState = atom({
  key: "guestUsers",
  default: {},
});

const totalFareSupply = atom({
  key: "totalFareSupply",
  default: "loading total fare supply...",
});

const currentRoundId = atom({
  key: "currentRoundId",
  default: 0,
});

const timerState = atom({
  key: "timer",
  default: "loading...",
});

function Room() {
  const [users, setUsers] = useRecoilState(userState);
  const [guestUsers, setGuestUsers] = useRecoilState(guestUserState);
  const [timer, setTimer] = useRecoilState(timerState);
  const [totalSupply, setTotalSupply] = useRecoilState(totalFareSupply);
  const [rid, setCurrentRoundId] = useRecoilState(currentRoundId);

  useEffect(() => {
    (async () => {
      await connectToRoom(
        users,
        setUsers,
        guestUsers,
        setGuestUsers,
        timer,
        setTimer,
        setTotalSupply,
        setCurrentRoundId
      );
    })();
  }, []);

  console.log(timer);

  return (
    <>
      <h1>SpinRoom - {timer}</h1>
      <h2>Total FARE Supply - {totalSupply}</h2>
      <h2>CurrentRoundId - {rid}</h2>
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

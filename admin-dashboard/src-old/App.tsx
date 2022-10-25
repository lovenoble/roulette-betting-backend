// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useRef } from "react";

// // Pages
// // import Login from './Pages/Login'
// // import SignUp from './Pages/SignUp'
// import ChatRoom from "./Pages/ChatRoom";
// import ConnectWallet from "./Pages/ConnectWallet";
// import Lobby from "./Pages/Lobby";
// import Crypto from "./Pages/Crypto";
// import Games from "./Pages/Games";
// import Pump from "./Pages/CryptoPump";
// import Metaverse from "./Pages/Metaverse";
// import ProMode from "./Pages/ProMode";

// // Providers
// import AuthProvider from "./contexts/AuthProvider";
// import PearProvider from "./contexts/PearProvider";
// import RealtimeProvider from "./contexts/RealtimeProvider";
// import MetaverseProvider from "./contexts/MetaverseProvider";

// // Components
// import PrivateOutlet from "./Components/Utils/PrivateOutlet";
// import Layout from "./Components/Core/Layout";
// import NetworkEventListener from "./Components/Core/NetworkEventListener";

// function App() {
//     const layoutRef = useRef(null);

//     return (
//         <Layout ref={layoutRef}>
//             <PearProvider layoutRef={layoutRef}>
//                 <AuthProvider>
//                     <RealtimeProvider>
//                         <MetaverseProvider>
//                             <Router>
//                                 <Routes>
//                                     <Route
//                                         path="/"
//                                         element={<PrivateOutlet layoutRef={layoutRef} />}
//                                     >
//                                         <Route index element={<Lobby />} />
//                                         <Route path="chat" element={<ChatRoom />} />
//                                         <Route path="crypto">
//                                             <Route index element={<Crypto />} />
//                                             <Route path="games" element={<Games />} />
//                                             <Route path="pump" element={<Pump />} />
//                                         </Route>
//                                         <Route path="metaverse" element={<Metaverse />} />
//                                     </Route>
//                                     {/* <Route path="chat">
//                                     <Route index element={<ChatRoom />} />
//                                 </Route> */}
//                                     {/* <Route path="login" element={<Login />} /> */}
//                                     {/* <Route path="signup" element={<SignUp />} /> */}
//                                     <Route path="/connect-wallet" element={<ConnectWallet />} />
//                                     <Route path="/pro-mode" element={<ProMode />} />
//                                 </Routes>
//                                 <NetworkEventListener />
//                             </Router>
//                         </MetaverseProvider>
//                     </RealtimeProvider>
//                 </AuthProvider>
//             </PearProvider>
//         </Layout>
//     );
// }

// export default App;

import { useState } from "react";
import BottomBar from "../components/BottomBar";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";

export default function AppShell(){
  const [tab, setTab] = useState("home");
  return (
    <>
      {tab === "home" && <Home />}
      {tab === "cart" && <Cart />}
      {tab === "profile" && <Profile />}
      <BottomBar current={tab} onNav={setTab} />
    </>
  );
}

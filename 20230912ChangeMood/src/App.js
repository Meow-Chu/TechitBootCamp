import MenuList from "./Components/MenuList";
import DisplayMood from "./Components/DisplayMood";
import { useState } from "react";
import "./App.css";

function App() {
  const [currentMood, setCurrentMood] = useState("");

  return (
    <div className="wrap">
      <h1>오늘의 기분을 선택해주세요 ! </h1>
      <MenuList setCurrentMood={setCurrentMood} />
      <DisplayMood mood={currentMood} />
    </div>
  );
}

export default App;

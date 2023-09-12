import "./DisplayMood.css";
import React from "react";

export default function DisplayMood(props) {
  return (
    <div>
      <h2 className="mood-container">
        {props.mood ? `오늘 기분이${props.mood}` : "아직 선택하지 않았어요.."}
      </h2>
    </div>
  );
}

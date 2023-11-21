import "./MenuList.css";
import MenuListItem from "./MenuListItem";
import React from "react";

export default function MenuList(props) {
  const menus = [
    "좋아요! 😃",
    "정말 좋아요! 🤭",
    "최고에요! 😄",
    "미쳤어요!! 🤪",
  ];

  return (
    <ul className="Mood-list">
      {menus.map((moodEl, index) => {
        return (
          <MenuListItem
            key={index}
            mood={moodEl}
            setCurrentMood={props.setCurrentMood}
          />
        );
      })}
    </ul>
  );
}

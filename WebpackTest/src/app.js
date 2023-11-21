import plus from "./plus.js";
import "./style.css"; // 리액트 문법이 아닌 웹팩문법이라 import가 가능함
import tiger from "./tiger.png";

console.log(plus(2, 3));

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `<img src="${tiger}"/>`;
});

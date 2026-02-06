const cursor = document.getElementById("cursor");

window.addEventListener("pointermove", (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

const panel = document.querySelector(".product");
const board = document.querySelector(".board");

panel.addEventListener("pointermove", (event) => {
  const rect = panel.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  board.style.transform = `perspective(700px) rotateX(${35 - y * 12}deg) rotateZ(${-20 + x * 16}deg) translate(${x * 12}px, ${y * 8}px)`;
});

panel.addEventListener("pointerleave", () => {
  board.style.transform = "perspective(700px) rotateX(35deg) rotateZ(-20deg)";
});

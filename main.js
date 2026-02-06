const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

const dots = [];
const count = 110;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init() {
  dots.length = 0;
  for (let i = 0; i < count; i += 1) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      v: Math.random() * 0.25 + 0.05,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const d of dots) {
    d.y -= d.v;
    if (d.y < -5) {
      d.y = canvas.height + 5;
      d.x = Math.random() * canvas.width;
    }

    ctx.fillStyle = "rgba(172,196,255,0.7)";
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

resize();
init();
draw();
window.addEventListener("resize", () => {
  resize();
  init();
});

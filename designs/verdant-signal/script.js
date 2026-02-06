const canvas = document.getElementById("wave");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function draw(time) {
  const t = time * 0.001;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let line = 0; line < 4; line += 1) {
    const amp = 22 + line * 12;
    const yBase = canvas.height * (0.34 + line * 0.14);
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 6) {
      const y = yBase + Math.sin(x * 0.014 + t * (1.1 + line * 0.3)) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(143,247,168,${0.22 + line * 0.13})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

resize();
draw(0);
window.addEventListener("resize", resize);

const counters = [...document.querySelectorAll(".stats h2")];

const countObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const target = Number(el.dataset.target || "0");
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const tick = () => {
        value += step;
        if (value >= target) value = target;
        el.textContent = String(value);
        if (value < target) requestAnimationFrame(tick);
      };
      tick();
      countObserver.unobserve(el);
    }
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => countObserver.observe(counter));

const cards = [...document.querySelectorAll(".cards article")];
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.25 }
);
cards.forEach((card) => cardObserver.observe(card));

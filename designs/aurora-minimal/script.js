const story = document.getElementById("story");
const device = document.getElementById("device");
const modules = document.getElementById("modules");
const copies = [...document.querySelectorAll(".copy")];
const progress = document.getElementById("progress");

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function update() {
  const total = story.offsetHeight - window.innerHeight;
  const p = clamp((window.scrollY - story.offsetTop) / total, 0, 1);

  const rotateX = 56 - p * 34;
  const rotateZ = -26 + p * 20;
  const moveY = p * 170;
  const moveX = p * 50;
  const scale = 1 + p * 0.1;

  device.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;

  const moduleOpacity = clamp((p - 0.24) / 0.3, 0, 1) * clamp((0.95 - p) / 0.35, 0, 1);
  modules.style.opacity = moduleOpacity.toFixed(3);
  modules.style.transform = `translateX(${40 - p * 55}px) translateY(${-10 + p * 20}px)`;

  const stage = Math.min(3, Math.floor(p * 4));
  copies.forEach((copy, i) => copy.classList.toggle("active", i === stage));

  progress.style.width = `${Math.max(8, p * 100)}%`;
}

window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);
update();

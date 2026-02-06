const hero = document.getElementById("heroDevice");

hero.addEventListener("pointermove", (event) => {
  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  hero.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 12}deg)`;
});

hero.addEventListener("pointerleave", () => {
  hero.style.transform = "rotateX(0deg) rotateY(0deg)";
});

const dials = [...document.querySelectorAll(".dial")];

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const dial = entry.target;
      const target = Number(dial.dataset.fill || "0");
      let value = 0;
      const tick = () => {
        value += 1;
        dial.style.setProperty("--fill", value);
        dial.setAttribute("data-fill", String(value));
        if (value < target) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(dial);
    }
  },
  { threshold: 0.6 }
);

dials.forEach((dial) => {
  dial.style.setProperty("--fill", 0);
  observer.observe(dial);
});

const buttons = document.querySelectorAll(".service-button");
const countdown = document.querySelector("[data-countdown]");
const viewButtons = document.querySelectorAll("[data-open-service]");
const views = document.querySelectorAll("[data-view]");

const showView = (name) => {
  views.forEach((view) => {
    view.classList.toggle("is-hidden", view.dataset.view !== name);
  });
};

buttons.forEach((button) => {
  button.addEventListener("pointerdown", () => {
    button.classList.add("is-pressed");
  });

  button.addEventListener("pointerup", () => {
    button.classList.remove("is-pressed");
  });

  button.addEventListener("pointerleave", () => {
    button.classList.remove("is-pressed");
  });
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.openService);
  });
});

if (countdown) {
  const targetDate = new Date(countdown.dataset.countdown).getTime();
  const days = countdown.querySelector("[data-countdown-days]");
  const hours = countdown.querySelector("[data-countdown-hours]");
  const minutes = countdown.querySelector("[data-countdown-minutes]");
  const seconds = countdown.querySelector("[data-countdown-seconds]");
  const second = 1000;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const updateCountdown = () => {
    const remaining = Math.max(targetDate - Date.now(), 0);

    days.textContent = String(Math.floor(remaining / day)).padStart(3, "0");
    hours.textContent = String(Math.floor((remaining % day) / hour)).padStart(2, "0");
    minutes.textContent = String(Math.floor((remaining % hour) / minute)).padStart(2, "0");
    seconds.textContent = String(Math.floor((remaining % minute) / second)).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, second);
}

const canvas = document.querySelector(".cursor-trail");
const ctx = canvas.getContext("2d");
const particles = [];
const symbols = ["0", "1", "{ }", "</>", "()", "[]", ";"];
let width = 0;
let height = 0;
let lastSpawn = 0;

const resizeCanvas = () => {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const addParticle = (x, y) => {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.7 + 0.25;

  particles.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.25,
    life: 1,
    size: Math.random() * 9 + 12,
    rotation: Math.random() * 0.5 - 0.25,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
  });

  if (particles.length > 90) {
    particles.shift();
  }
};

const draw = () => {
  ctx.clearRect(0, 0, width, height);

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.98;
    particle.vy *= 0.98;
    particle.life -= 0.018;

    if (particle.life <= 0) {
      particles.splice(index, 1);
      continue;
    }

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.life * 0.78;
    ctx.fillStyle = "#53ff8f";
    ctx.shadowColor = "rgba(83, 255, 143, 0.55)";
    ctx.shadowBlur = 12;
    ctx.font = `600 ${particle.size}px Inter, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(particle.symbol, 0, 0);
    ctx.restore();
  }

  requestAnimationFrame(draw);
};

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  const now = performance.now();

  if (now - lastSpawn > 28) {
    addParticle(event.clientX, event.clientY);
    lastSpawn = now;
  }
});

resizeCanvas();
draw();

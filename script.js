const buttons = document.querySelectorAll(".service-button");

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

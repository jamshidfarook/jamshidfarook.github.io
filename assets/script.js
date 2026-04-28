// ── Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── Animated particle canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true) }
  reset(initial) {
    this.x  = Math.random() * W;
    this.y  = initial ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.2 + 0.2;
    this.vy = -(Math.random() * 0.35 + 0.05);
    this.vx = (Math.random() - 0.5) * 0.15;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
    const gold = Math.random() > 0.5;
    this.color = gold ? `201,168,76` : `77,217,192`;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
  }
  draw() {
    const a = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${a})`;
    ctx.fill();
  }
}

const particleCount = window.innerWidth < 768 ? 35 : 120;
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function tick() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(tick);
}
tick();

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  document.getElementById('toggle-icon').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
// Restore saved theme on load
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  document.getElementById('toggle-icon').textContent = '☀️';
}

function toggleMenu(btn) {
  const drawer = document.getElementById('nav-drawer');
  const open = drawer.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}
function closeMenu() {
  document.getElementById('nav-drawer').classList.remove('open');
  document.querySelector('.nav-burger').classList.remove('open');
}
// Close drawer on outside click
document.addEventListener('click', e => {
  const drawer = document.getElementById('nav-drawer');
  if (drawer.classList.contains('open') && !e.target.closest('nav')) closeMenu();
});

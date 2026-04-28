import './style.css';
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/* ── Cursor ── */
const cursor = document.getElementById('cursor');
let mx = -100, my = -100;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
document.querySelectorAll('a, button, .proj-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

/* ── Canvas animated BG ── */
(function() {
  const canvas = document.getElementById('scrub-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let scrollY = 0;

    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      frame++;
      const t = frame * 0.003 + scrollY * 0.0015;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0d0c0b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pools = [
        { x: .3 + Math.sin(t * .7) * .08,  y: .4 + Math.cos(t * .5) * .1,  r: .55, a: .07 },
        { x: .7 + Math.cos(t * .6) * .06,  y: .6 + Math.sin(t * .8) * .08, r: .45, a: .05 },
        { x: .5 + Math.sin(t * .9) * .04,  y: .2 + Math.cos(t * .4) * .05, r: .35, a: .04 },
      ];
      pools.forEach(p => {
        const grd = ctx.createRadialGradient(
          p.x * canvas.width, p.y * canvas.height, 0,
          p.x * canvas.width, p.y * canvas.height, p.r * Math.max(canvas.width, canvas.height)
        );
        grd.addColorStop(0, `rgba(220,210,195,${p.a})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      requestAnimationFrame(draw);
    }
    draw();
  }
})();

/* ── Hero fade on scroll ── */
const heroSection = document.querySelector('.hero-section');

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const vh = window.innerHeight;

      heroSection.style.opacity = 1 - Math.min(sy / (vh * 0.50), 1);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── Card reveal on scroll ── */
const cards = document.querySelectorAll('.proj-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = (entry.target.dataset.index || 0) * 80;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

cards.forEach(c => io.observe(c));

/* ── Video hover previews ── */
document.querySelectorAll('.proj-card:not(:nth-child(1))').forEach(card => {
  const video = card.querySelector('.proj-video');
  if (!video) return;
  card.addEventListener('mouseenter', () => video.play());
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* ── Smooth nav link scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

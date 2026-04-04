const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let w, h, cx, cy, tick = 0;
let hexes = [];

const opts = {
  radius: 52,
  lineWidth: 2.4,
  crustWidth: 3.4,
  glowBlur: 34,
  bgFade: 0.06,

  traceSpeed: 0.14,
  traceLength: 88,

  waveSpacing: 150,
  waveWidth: 170,
  waveTravelSpeed: 0.9,

  pulseAmount: 0.14,
  pulseSpeed: 0.03
};

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  cx = w / 2;
  cy = h / 2;
  buildGrid();
}
window.addEventListener('resize', resize);

function hexPoints(x, y, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push({
      x: x + Math.cos(a) * r,
      y: y + Math.sin(a) * r
    });
  }
  return pts;
}

function strokeHex(points, stroke, width, glow = 0) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();

  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = stroke;
  ctx.shadowBlur = glow;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function fillHex(points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function buildGrid() {
  hexes = [];

  const r = opts.radius;
  const xStep = r * 1.5;
  const yStep = Math.sqrt(3) * r;

  const cols = Math.ceil(w / xStep) + 4;
  const rows = Math.ceil(h / yStep) + 4;

  for (let col = -2; col < cols; col++) {
    for (let row = -2; row < rows; row++) {
      const x = col * xStep;
      const y = row * yStep + (col % 2 ? yStep / 2 : 0);

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      hexes.push({
        x,
        y,
        dist,
        offset: Math.random() * 700,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }
}

function bandStrength(distance, centerRadius) {
  const diff = Math.abs(distance - centerRadius);
  if (diff > opts.waveWidth) return 0;
  const t = 1 - diff / opts.waveWidth;
  return t * t;
}

function getContinuousWaveStrength(dist) {
  const travel = tick * opts.waveTravelSpeed;
  let strength = 0;

  for (let i = -2; i < 8; i++) {
    const centerRadius = (travel - i * opts.waveSpacing) % (opts.waveSpacing * 8);
    const fixedRadius = centerRadius < 0 ? centerRadius + opts.waveSpacing * 8 : centerRadius;
    strength = Math.max(strength, bandStrength(dist, fixedRadius));
  }

  return Math.max(0, Math.min(1, strength));
}

function getCrackColor(intensity) {
  if (intensity > 0.78) return `rgba(255, 215, 120, ${0.95 * intensity})`;
  if (intensity > 0.52) return `rgba(255, 125, 35, ${0.88 * intensity})`;
  if (intensity > 0.24) return `rgba(210, 68, 22, ${0.74 * intensity})`;
  return `rgba(115, 26, 16, ${0.56 * intensity})`;
}

function getCrustStroke(intensity) {
  if (intensity > 0.65) return `rgba(62, 18, 14, 0.78)`;
  if (intensity > 0.28) return `rgba(46, 14, 11, 0.82)`;
  return `rgba(30, 10, 9, 0.86)`;
}

function drawMoltenGlow(x, y, intensity) {
  if (intensity < 0.05) return;

  const grad = ctx.createRadialGradient(
    x, y, 0,
    x, y, opts.radius * (0.9 + intensity * 0.9)
  );

  grad.addColorStop(0, `rgba(255, 236, 160, ${0.11 * intensity})`);
  grad.addColorStop(0.28, `rgba(255, 150, 45, ${0.14 * intensity})`);
  grad.addColorStop(0.58, `rgba(224, 72, 24, ${0.12 * intensity})`);
  grad.addColorStop(0.85, `rgba(110, 24, 14, ${0.08 * intensity})`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.arc(x, y, opts.radius * (0.92 + intensity * 0.34), 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function animate() {
  requestAnimationFrame(animate);
  tick++;

  ctx.fillStyle = `rgba(6, 2, 1, ${opts.bgFade})`;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < hexes.length; i++) {
    const hex = hexes[i];
    const pts = hexPoints(hex.x, hex.y, opts.radius);

    const wave = getContinuousWaveStrength(hex.dist);
    const pulse = 1 + Math.sin(tick * opts.pulseSpeed + hex.pulseOffset) * opts.pulseAmount;
    const intensity = Math.max(0, Math.min(1, wave * pulse));

    fillHex(pts, 'rgba(18, 8, 7, 0.15)');

    const crustStroke = getCrustStroke(intensity);
    strokeHex(pts, crustStroke, opts.crustWidth, 0);

    if (intensity <= 0.01) continue;

    drawMoltenGlow(hex.x, hex.y, intensity);

    ctx.setLineDash([opts.traceLength, 999]);
    ctx.lineDashOffset = -(tick * opts.traceSpeed + hex.offset);

    const lavaStroke = getCrackColor(intensity);
    strokeHex(
      pts,
      lavaStroke,
      opts.lineWidth + intensity * 1.2,
      opts.glowBlur * intensity
    );
  }

  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
}

resize();
animate();
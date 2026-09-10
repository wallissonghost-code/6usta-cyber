/* ==========================================================
   1. DIMENSÕES NATIVAS DO SMARTPHONE
   ========================================================== */
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const viewport = document.getElementById('viewport');
viewport.style.transform = 'none';

/* ==========================================================
   2. SÍNTESE DE ÁUDIO REAL-TIME (Web Audio API)
   ========================================================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function startGame() {
  initAudio();
  const overlay = document.getElementById('start-overlay');
  if (overlay) overlay.style.display = 'none';
}

function playSound(type) {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'score') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'boss_hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (e) {}
}

/* ==========================================================
   3. FÍSICA DINÂMICA MATTER.JS
   ========================================================== */
const { Engine, World, Bodies, Body, Events } = Matter;

const engine = Engine.create({
  gravity: { x: 0, y: 1.4, scale: 0.001 }
});
const world = engine.world;

const fxCanvas = document.getElementById('fx-canvas');
const ctx = fxCanvas.getContext('2d');
fxCanvas.width = WIDTH;
fxCanvas.height = HEIGHT;

// Paredes delimitadoras na largura real do celular
World.add(world, [
  Bodies.rectangle(WIDTH / 2, -30, WIDTH, 60, { isStatic: true }),
  Bodies.rectangle(-20, HEIGHT / 2, 40, HEIGHT, { isStatic: true, restitution: 0.6 }),
  Bodies.rectangle(WIDTH + 20, HEIGHT / 2, 40, HEIGHT, { isStatic: true, restitution: 0.6 })
]);

// Boss Central (Escalado para smartphone)
const bossRadius = Math.min(WIDTH * 0.12, 45);
const bossBody = Bodies.polygon(WIDTH / 2, HEIGHT * 0.28, 6, bossRadius, {
  isStatic: true,
  label: 'boss'
});
World.add(world, bossBody);

// Pinos Plinko distribuídos pela tela do celular
const pins = [];
const pinRows = 6;
const startY = HEIGHT * 0.38;
const spacingY = Math.min((HEIGHT * 0.32) / pinRows, 65);

for (let row = 0; row < pinRows; row++) {
  const pinCount = (row % 2 === 0) ? 6 : 5;
  const spacingX = WIDTH / (pinCount + 1);

  for (let col = 1; col <= pinCount; col++) {
    pins.push(Bodies.circle(spacingX * col, startY + (row * spacingY), 6, {
      isStatic: true,
      restitution: 0.9,
      friction: 0.01,
      label: 'pin'
    }));
  }
}
World.add(world, pins);

// Divisórias dos slots
const slotCount = 5;
const slotWidth = WIDTH / slotCount;
const slotLimitY = HEIGHT - 180;

for (let i = 1; i < slotCount; i++) {
  World.add(world, Bodies.rectangle(i * slotWidth, slotLimitY - 30, 6, 75, {
    isStatic: true,
    label: 'divider'
  }));
}

// Sensor de coleta
const floorSensor = Bodies.rectangle(WIDTH / 2, slotLimitY + 15, WIDTH, 40, {
  isStatic: true,
  isSensor: true,
  label: 'floorSensor'
});
World.add(world, floorSensor);

/* ==========================================================
   4. REGRAS DO JOGO E PARTICULAS
   ========================================================== */
let bossMaxHp = 1200;
let bossCurrentHp = bossMaxHp;
const multipliers = [2, 5, 15, 5, 2];
const userScores = {};
const activeBalls = [];
const fxParticles = [];

function damageBoss(dmg, username) {
  bossCurrentHp = Math.max(0, bossCurrentHp - dmg);
  const pct = (bossCurrentHp / bossMaxHp) * 100;
  
  const fillElem = document.getElementById('boss-fill');
  const hpElem = document.getElementById('boss-hp');
  if (fillElem) fillElem.style.width = pct + '%';
  if (hpElem) hpElem.innerText = Math.ceil(pct) + '%';
  
  playSound('boss_hit');

  fxParticles.push({
    x: bossBody.position.x,
    y: bossBody.position.y,
    isWave: true,
    radius: 15,
    color: '#ff0055',
    alpha: 1,
    speed: 6
  });

  if (bossCurrentHp <= 0) {
    bossCurrentHp = bossMaxHp;
    if (fillElem) fillElem.style.width = '100%';
    if (hpElem) hpElem.innerText = '100%';
    showToast(`💥 ${username} FINALIZOU O BOSS!`, '#ffe600');
    if (window.confetti) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } });
    }
  }
}

function dropBall(options) {
  const { username, color, radius = 9, damage, scoreValue, density = 0.002 } = options;
  const spawnX = (WIDTH / 2) + (Math.random() * (WIDTH * 0.4) - (WIDTH * 0.2));

  const ball = Bodies.circle(spawnX, HEIGHT * 0.15, radius, {
    restitution: 0.8,
    friction: 0.02,
    density: density,
    label: 'ball'
  });

  ball.gameData = { username, color, radius, damage, scoreValue };
  activeBalls.push(ball);
  World.add(world, ball);
}

Events.on(engine, 'collisionStart', (evt) => {
  evt.pairs.forEach(pair => {
    const labels = [pair.bodyA.label, pair.bodyB.label];

    if (labels.includes('ball') && labels.includes('pin')) {
      const pin = pair.bodyA.label === 'pin' ? pair.bodyA : pair.bodyB;
      createSparks(pin.position.x, pin.position.y, '#00f0ff', 4);
      playSound('hit');
    }

    if (labels.includes('ball') && labels.includes('boss')) {
      const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB;
      damageBoss(ball.gameData.damage, ball.gameData.username);
    }

    if (labels.includes('ball') && labels.includes('floorSensor')) {
      const ball = pair.bodyA.label === 'ball' ? pair.bodyA : pair.bodyB;
      finishBall(ball);
    }
  });
});

function finishBall(ball) {
  const index = Math.floor(ball.position.x / slotWidth);
  const safeIndex = Math.min(Math.max(index, 0), slotCount - 1);
  const mult = multipliers[safeIndex];

  const slotElem = document.getElementById(`slot-${safeIndex}`);
  if (slotElem) {
    slotElem.classList.add('active');
    setTimeout(() => slotElem.classList.remove('active'), 200);
  }

  const pts = ball.gameData.scoreValue * mult;
  userScores[ball.gameData.username] = (userScores[ball.gameData.username] || 0) + pts;

  let topUser = '';
  let topScore = -1;
  for (const [u, score] of Object.entries(userScores)) {
    if (score > topScore) {
      topScore = score;
      topUser = u;
    }
  }

  const topUserEl = document.getElementById('top-user');
  const topScoreEl = document.getElementById('top-score');
  if (topUserEl) topUserEl.innerText = topUser;
  if (topScoreEl) topScoreEl.innerText = `${topScore.toLocaleString()} PTS`;

  createSparks(ball.position.x, slotLimitY, ball.gameData.color, 10);
  playSound('score');

  World.remove(world, ball);
  const idx = activeBalls.indexOf(ball);
  if (idx !== -1) activeBalls.splice(idx, 1);
}

function createSparks(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    fxParticles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      radius: Math.random() * 2.5 + 1,
      color,
      alpha: 1,
      life: 0.05
    });
  }
}

function showToast(text, borderColor = '#00f0ff') {
  const feed = document.getElementById('toast-feed');
  if (!feed) return;
  const toast = document.createElement('div');
  toast.className = 'toast-entry';
  toast.style.borderLeftColor = borderColor;
  toast.innerText = text;
  feed.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ==========================================================
   5. LOOP PRINCIPAL DE RENDERIZAÇÃO CANVAS
   ========================================================== */
function renderLoop() {
  Engine.update(engine, 1000 / 60);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Boss Hexagonal
  Body.rotate(bossBody, 0.012);
  ctx.save();
  ctx.translate(bossBody.position.x, bossBody.position.y);
  ctx.rotate(bossBody.angle);
  ctx.fillStyle = 'rgba(255, 0, 85, 0.2)';
  ctx.strokeStyle = '#ff0055';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#ff0055';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const rad = (Math.PI / 3) * i;
    const px = bossRadius * Math.cos(rad);
    const py = bossRadius * Math.sin(rad);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Pinos Plinko
  pins.forEach(pin => {
    ctx.beginPath();
    ctx.arc(pin.position.x, pin.position.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
  });

  // Esferas
  activeBalls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.gameData.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.gameData.color;
    ctx.shadowBlur = 14;
    ctx.shadowColor = ball.gameData.color;
    ctx.fill();

    ctx.font = "bold 11px 'Rajdhani'";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(ball.gameData.username, ball.position.x, ball.position.y - (ball.gameData.radius + 4));
  });

  // Partículas
  for (let i = fxParticles.length - 1; i >= 0; i--) {
    const p = fxParticles[i];
    if (p.isWave) {
      p.radius += p.speed;
      p.alpha -= 0.04;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (p.alpha <= 0) fxParticles.splice(i, 1);
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (p.alpha <= 0) fxParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

/* ==========================================================
   6. HANDLERS DOS EVENTOS DA LIVE
   ========================================================== */
function triggerLike(user) {
  dropBall({ username: user, color: '#00f0ff', radius: 7, damage: 15, scoreValue: 5 });
}

function triggerComment(user, text) {
  showToast(`${user}: ${text}`, '#00f0ff');
  dropBall({ username: user, color: '#ffe600', radius: 9, damage: 30, scoreValue: 25, density: 0.003 });
}

function triggerGift(user, name) {
  showToast(`🎁 ${user} mandou ${name}!`, '#ff0055');
  if (name === 'Rosa') {
    dropBall({ username: user, color: '#ff0055', radius: 12, damage: 100, scoreValue: 120, density: 0.005 });
  } else if (name === 'Capivara') {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        dropBall({ username: user, color: '#39ff14', radius: 10, damage: 80, scoreValue: 90 });
      }, i * 140);
    }
  } else {
    dropBall({ username: user, color: '#b000ff', radius: 18, damage: 500, scoreValue: 1500, density: 0.02 });
  }
}

/* ==========================================================
   7. WEBSOCKET COM SERVER.JS
   ========================================================== */
function setupWebSocket() {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'like') triggerLike(msg.user);
      if (msg.type === 'comment') triggerComment(msg.user, msg.text);
      if (msg.type === 'gift') triggerGift(msg.user, msg.name);
    } catch (err) {}
  };

  ws.onclose = () => {
    setTimeout(setupWebSocket, 3000);
  };
}
setupWebSocket();

function hideDock() {
  const dock = document.getElementById('debug-dock');
  if (dock) dock.style.display = 'none';
}

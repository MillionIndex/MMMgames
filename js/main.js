const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const pointsDisplay = document.getElementById("points");
const summonSwordBtn = document.getElementById("summon-sword");
const summonArcherBtn = document.getElementById("summon-archer");

// ゲーム状態
let points = 160;
let playerUnits = [];
let enemyUnits = [];
let gameOver = false;

// タワー
const playerTower = { x: 50, y: 140, width: 40, height: 100, hp: 500, maxHp: 500 };
const enemyTower = { x: 710, y: 140, width: 40, height: 100, hp: 500, maxHp: 500 };

// 画面サイズ対応
function resizeCanvas() {
  const maxWidth = Math.min(window.innerWidth - 40, 900);
  const scale = maxWidth / 800;
  canvas.style.width = maxWidth + "px";
  canvas.style.height = (400 * scale) + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ポイント回復
setInterval(() => {
  if (gameOver) return;
  points += 10;
  pointsDisplay.textContent = Math.floor(points);
}, 700);

// 召喚
function summon(type) {
  if (gameOver) return;

  const data = CHARACTERS[type];
  if (points < data.cost) return;

  points -= data.cost;
  pointsDisplay.textContent = Math.floor(points);

  playerUnits.push({
    ...data,
    x: playerTower.x + 60,
    y: 170,
    currentHp: data.hp,
    side: "player",
    attackCooldown: 0
  });
}

summonSwordBtn.addEventListener("click", () => summon("sword"));
summonArcherBtn.addEventListener("click", () => summon("archer"));

// 敵生成
function spawnEnemy() {
  if (gameOver) return;

  const data = CHARACTERS.sword;
  enemyUnits.push({
    ...data,
    x: enemyTower.x - 60,
    y: 170,
    currentHp: data.hp,
    speed: -data.speed,
    color: "#9c27b0",
    side: "enemy",
    attackCooldown: 0
  });
}

setInterval(spawnEnemy, 2600);

// 距離計算
function getDistance(a, b) {
  return Math.abs(a.x - b.x);
}

// 戦闘処理
function handleCombat() {
  if (gameOver) return;

  playerUnits.forEach(p => {
    enemyUnits.forEach(e => {
      if (getDistance(p, e) < p.range + 20) {
        if (p.attackCooldown <= 0) {
          e.currentHp -= p.attack;
          p.attackCooldown = 45;
        }
        if (e.attackCooldown <= 0) {
          p.currentHp -= e.attack;
          e.attackCooldown = 45;
        }
      }
    });
  });

  playerUnits.forEach(u => { if (u.attackCooldown > 0) u.attackCooldown--; });
  enemyUnits.forEach(u => { if (u.attackCooldown > 0) u.attackCooldown--; });

  // タワー攻撃
  playerUnits.forEach(p => {
    if (p.x + 30 >= enemyTower.x) {
      enemyTower.hp -= p.attack * 0.1;
      if (enemyTower.hp < 0) enemyTower.hp = 0;
    }
  });

  enemyUnits.forEach(e => {
    if (e.x <= playerTower.x + playerTower.width) {
      playerTower.hp -= e.attack * 0.1;
      if (playerTower.hp < 0) playerTower.hp = 0;
    }
  });

  if (playerTower.hp <= 0 || enemyTower.hp <= 0) {
    gameOver = true;
  }
}

// 更新
function update() {
  if (gameOver) return;

  playerUnits.forEach(unit => {
    const nearEnemy = enemyUnits.some(e => getDistance(unit, e) < unit.range);
    if (!nearEnemy) unit.x += unit.speed;
  });

  enemyUnits.forEach(unit => {
    const nearPlayer = playerUnits.some(p => getDistance(unit, p) < unit.range);
    if (!nearPlayer) unit.x += unit.speed;
  });

  handleCombat();

  playerUnits = playerUnits.filter(u => u.currentHp > 0 && u.x < canvas.width + 50);
  enemyUnits = enemyUnits.filter(u => u.currentHp > 0 && u.x > -50);
}

// HPバー描画
function drawHpBar(x, y, width, height, current, max, color) {
  // 背景
  ctx.fillStyle = "#333";
  ctx.fillRect(x, y, width, height);
  // HP
  const ratio = Math.max(0, current / max);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * ratio, height);
  // 枠
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 自タワー
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);

  // 敵タワー
  ctx.fillStyle = "#f44336";
  ctx.fillRect(enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);

  // 自軍
  playerUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText(Math.floor(unit.currentHp), unit.x, unit.y - 5);
  });

  // 敵
  enemyUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText(Math.floor(unit.currentHp), unit.x, unit.y - 5);
  });

  // ===== 下部の大きなHPバー =====
  // 自タワーHPバー
  drawHpBar(30, 360, 340, 22, playerTower.hp, playerTower.maxHp, "#4caf50");
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText("自タワー HP: " + Math.floor(playerTower.hp), 40, 355);

  // 敵タワーHPバー
  drawHpBar(430, 360, 340, 22, enemyTower.hp, enemyTower.maxHp, "#f44336");
  ctx.fillStyle = "#fff";
  ctx.fillText("敵タワー HP: " + Math.floor(enemyTower.hp), 440, 355);

  // 勝敗表示
  if (gameOver) {
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    if (playerTower.hp <= 0) {
      ctx.fillStyle = "#ff4444";
      ctx.fillText("敗北...", canvas.width / 2, 200);
    } else {
      ctx.fillStyle = "#44ff44";
      ctx.fillText("勝利！", canvas.width / 2, 200);
    }
    ctx.textAlign = "left";
  }
}

// ゲームループ
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

pointsDisplay.textContent = points;
requestAnimationFrame(gameLoop);

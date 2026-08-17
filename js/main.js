const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const pointsDisplay = document.getElementById("points");
const summonSwordBtn = document.getElementById("summon-sword");
const summonArcherBtn = document.getElementById("summon-archer");

// ゲーム状態
let points = 100;
let playerUnits = [];
let enemyUnits = [];

// タワー
const playerTower = { x: 50, y: 150, width: 40, height: 100, hp: 500 };
const enemyTower = { x: 710, y: 150, width: 40, height: 100, hp: 500 };

// ポイント回復
setInterval(() => {
  points += 5;
  pointsDisplay.textContent = points;
}, 1000);

// 召喚
function summon(type) {
  const data = CHARACTERS[type];
  if (points < data.cost) return;

  points -= data.cost;
  pointsDisplay.textContent = points;

  playerUnits.push({
    ...data,
    x: playerTower.x + 60,
    y: 180,
    currentHp: data.hp,
    side: "player",
    attackCooldown: 0
  });
}

summonSwordBtn.addEventListener("click", () => summon("sword"));
summonArcherBtn.addEventListener("click", () => summon("archer"));

// 敵生成
function spawnEnemy() {
  const data = CHARACTERS.sword;
  enemyUnits.push({
    ...data,
    x: enemyTower.x - 60,
    y: 180,
    currentHp: data.hp,
    speed: -data.speed,
    color: "#9c27b0",
    side: "enemy",
    attackCooldown: 0
  });
}

setInterval(spawnEnemy, 2500);

// 距離計算
function getDistance(a, b) {
  return Math.abs(a.x - b.x);
}

// 戦闘処理
function handleCombat() {
  // 自軍 vs 敵
  playerUnits.forEach(p => {
    enemyUnits.forEach(e => {
      if (getDistance(p, e) < p.range + 20) {
        // 攻撃クールダウン
        if (p.attackCooldown <= 0) {
          e.currentHp -= p.attack;
          p.attackCooldown = 60; // 約1秒に1回（60フレーム想定）
        }
        if (e.attackCooldown <= 0) {
          p.currentHp -= e.attack;
          e.attackCooldown = 60;
        }
      }
    });
  });

  // クールダウン減少
  playerUnits.forEach(u => { if (u.attackCooldown > 0) u.attackCooldown--; });
  enemyUnits.forEach(u => { if (u.attackCooldown > 0) u.attackCooldown--; });

  // タワーへの攻撃
  playerUnits.forEach(p => {
    if (p.x + 30 >= enemyTower.x) {
      enemyTower.hp -= p.attack * 0.05; // 連続ダメージを抑える
      if (enemyTower.hp < 0) enemyTower.hp = 0;
    }
  });

  enemyUnits.forEach(e => {
    if (e.x <= playerTower.x + playerTower.width) {
      playerTower.hp -= e.attack * 0.05;
      if (playerTower.hp < 0) playerTower.hp = 0;
    }
  });
}

// 更新
function update() {
  // 移動
  playerUnits.forEach(unit => {
    // 近くに敵がいるときは少し止まる（簡易）
    const nearEnemy = enemyUnits.some(e => getDistance(unit, e) < unit.range);
    if (!nearEnemy) {
      unit.x += unit.speed;
    }
  });

  enemyUnits.forEach(unit => {
    const nearPlayer = playerUnits.some(p => getDistance(unit, p) < unit.range);
    if (!nearPlayer) {
      unit.x += unit.speed;
    }
  });

  handleCombat();

  // 死亡・画面外削除
  playerUnits = playerUnits.filter(u => u.currentHp > 0 && u.x < canvas.width + 50);
  enemyUnits = enemyUnits.filter(u => u.currentHp > 0 && u.x > -50);
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 自タワー
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);
  ctx.fillStyle = "#fff";
  ctx.fillText(Math.floor(playerTower.hp), playerTower.x, playerTower.y - 8);

  // 敵タワー
  ctx.fillStyle = "#f44336";
  ctx.fillRect(enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);
  ctx.fillStyle = "#fff";
  ctx.fillText(Math.floor(enemyTower.hp), enemyTower.x, enemyTower.y - 8);

  // 自軍
  playerUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.fillText(Math.floor(unit.currentHp), unit.x, unit.y - 5);
  });

  // 敵
  enemyUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.fillText(Math.floor(unit.currentHp), unit.x, unit.y - 5);
  });

  // 勝敗表示（仮）
  if (playerTower.hp <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "40px sans-serif";
    ctx.fillText("敗北...", 320, 200);
  }
  if (enemyTower.hp <= 0) {
    ctx.fillStyle = "lime";
    ctx.font = "40px sans-serif";
    ctx.fillText("勝利！", 320, 200);
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

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
    side: "player"
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
    speed: -data.speed, // 左に進む
    color: "#9c27b0",
    side: "enemy"
  });
}

// 敵を2.5秒ごとに出す
setInterval(spawnEnemy, 2500);

// 更新
function update() {
  // 自軍移動
  playerUnits.forEach(unit => {
    unit.x += unit.speed;
  });

  // 敵移動
  enemyUnits.forEach(unit => {
    unit.x += unit.speed;
  });

  // 画面外・HP0のユニットを削除
  playerUnits = playerUnits.filter(u => u.x < canvas.width + 50 && u.currentHp > 0);
  enemyUnits = enemyUnits.filter(u => u.x > -50 && u.currentHp > 0);
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 自タワー
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);
  ctx.fillStyle = "#fff";
  ctx.fillText(playerTower.hp, playerTower.x, playerTower.y - 8);

  // 敵タワー
  ctx.fillStyle = "#f44336";
  ctx.fillRect(enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);
  ctx.fillStyle = "#fff";
  ctx.fillText(enemyTower.hp, enemyTower.x, enemyTower.y - 8);

  // 自軍
  playerUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.fillText(unit.currentHp, unit.x, unit.y - 5);
  });

  // 敵
  enemyUnits.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);
    ctx.fillStyle = "#fff";
    ctx.fillText(unit.currentHp, unit.x, unit.y - 5);
  });
}

// ゲームループ
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

pointsDisplay.textContent = points;
requestAnimationFrame(gameLoop);

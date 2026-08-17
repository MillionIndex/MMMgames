const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const pointsDisplay = document.getElementById("points");
const summonSwordBtn = document.getElementById("summon-sword");
const summonArcherBtn = document.getElementById("summon-archer");

// ゲーム状態
let points = 100;
let units = [];          // 召喚したユニットを入れる配列
let lastTime = 0;

// タワーの位置（仮）
const playerTower = { x: 50, y: 150, width: 40, height: 100 };
const enemyTower = { x: 710, y: 150, width: 40, height: 100 };

// ポイントを時間で回復
setInterval(() => {
  points += 5;
  pointsDisplay.textContent = points;
}, 1000);

// 召喚処理
function summon(type) {
  const data = CHARACTERS[type];
  if (points < data.cost) {
    console.log("ポイント不足");
    return;
  }

  points -= data.cost;
  pointsDisplay.textContent = points;

  units.push({
    ...data,
    x: playerTower.x + 50,
    y: 180,
    currentHp: data.hp
  });
}

summonSwordBtn.addEventListener("click", () => summon("sword"));
summonArcherBtn.addEventListener("click", () => summon("archer"));

// 描画
function draw() {
  // 背景クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 自タワー
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);

  // 敵タワー
  ctx.fillStyle = "#f44336";
  ctx.fillRect(enemyTower.x, enemyTower.y, enemyTower.width, enemyTower.height);

  // ユニット
  units.forEach(unit => {
    ctx.fillStyle = unit.color;
    ctx.fillRect(unit.x, unit.y, 30, 40);

    // 簡易HP表示
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText(unit.currentHp, unit.x, unit.y - 5);
  });
}

// 更新（移動）
function update() {
  units.forEach(unit => {
    unit.x += unit.speed;
  });

  // 画面外に出たユニットを削除（仮）
  units = units.filter(unit => unit.x < canvas.width + 50);
}

// ゲームループ
function gameLoop(timestamp) {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 開始
pointsDisplay.textContent = points;
requestAnimationFrame(gameLoop);

// 味方キャラクターデータベース
const playerUnitDb = [
  { id: 0, name: "わんこ", cost: 100, hp: 100, atk: 30, speed: 1.5, range: 25, color: '#2ecc71', atkInterval: 30 },
  { id: 1, name: "くま",   cost: 250, hp: 250, atk: 80, speed: 1.0, range: 30, color: '#3498db', atkInterval: 45 },
  { id: 2, name: "ぞう",   cost: 500, hp: 600, atk: 200, speed: 0.7, range: 40, color: '#9b59b6', atkInterval: 60 }
];

// 敵キャラクターデータベース
const enemyUnitDb = {
  basic:  { id: 'e0', name: "敵わんこ", hp: 60,  atk: 15, speed: 1.0, range: 25, color: '#e74c3c', atkInterval: 30 },
  strong: { id: 'e1', name: "敵ゴリラ", hp: 350, atk: 60, speed: 0.8, range: 30, color: '#c0392b', atkInterval: 50 }
};

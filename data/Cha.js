// data/Cha.js
// 味方キャラクターのデータベース
const playerUnitDb = [
  { id: 0, name: "Data1", cost: 100, hp: 100, atk: 10, speed: 1.5, range: 25, color: '#2ecc71' },
  { id: 1, name: "Data2",   cost: 250, hp: 250, atk: 25, speed: 1.0, range: 30, color: '#3498db' },
  { id: 2, name: "Data3",   cost: 500, hp: 600, atk: 50, speed: 0.7, range: 40, color: '#9b59b6' }
];

// 敵キャラクターのデータベース
const enemyUnitDb = {
  basic:  { id: 'e0', name: "Mob1", hp: 60,  atk: 6,  speed: 1.0, range: 25, color: '#e74c3c' },
  strong: { id: 'e1', name: "Mob2", hp: 350, atk: 22, speed: 0.8, range: 30, color: '#c0392b' }
};

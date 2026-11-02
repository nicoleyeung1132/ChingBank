// 這是一個共用的記憶體暫存檔
let globalPoints = 2500;

module.exports = {
  getPoints: () => globalPoints,
  updatePoints: (amount) => {
    globalPoints = amount;
    return globalPoints;
  },
  addPoints: (amount) => {
    globalPoints += amount;
    return globalPoints;
  },
  deductPoints: (amount) => {
    globalPoints -= amount;
    return globalPoints;
  }
};

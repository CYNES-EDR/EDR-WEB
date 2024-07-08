function calculatePercentages(obj: { [key: string]: number }): {
  [key: string]: string;
} {
  // Tính tổng các giá trị
  const total = Object.values(obj).reduce((acc, val) => acc + val, 0);

  // Tạo một object mới chứa phần trăm của từng giá trị
  const percentages: { [key: string]: string } = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const percentage = total === 0 ? 0 : (obj[key] / total) * 100;
      percentages[key] = isNaN(percentage) ? "0" : percentage.toFixed(0);
    }
  }

  return percentages;
}

export default calculatePercentages;

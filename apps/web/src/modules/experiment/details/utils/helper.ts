export const formatNumber = (num: number, decimals = 2) =>
  Number.isInteger(num) ? num : Number.parseFloat(num.toFixed(decimals));

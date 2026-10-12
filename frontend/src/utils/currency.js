/**
 * Format numeric amount into Bangladeshi Taka (BDT ৳) representation
 * @param {number|string} amount
 * @returns {string}
 */
export function formatBDT(amount) {
  const num = Number(amount) || 0;
  return `৳${num.toLocaleString('en-US')}`;
}

export default formatBDT;

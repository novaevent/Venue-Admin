/**
 * Format a number into Indian currency/lakh-crore style.
 *
 * @param value number to format
 * @param withSymbol whether to prefix ₹ symbol (default: false)
 * @returns formatted price string
 */
export function formatNumber(
  value: number | string,
  withSymbol = false
): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);

  // Intl.NumberFormat handles the Indian numbering system
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(num);

  return withSymbol ? `₹${formatted}` : formatted;
}

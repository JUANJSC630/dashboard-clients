export function formatPrice(price: number, currency = "COP"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Parses a user-typed amount that may use dots or commas as thousands
 * separators (e.g. "50.000" → 50000, "1,500.50" → 1500.50).
 * Returns NaN for invalid input.
 */
export function parseAmount(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return NaN;

  const hasDot = trimmed.includes(".");
  const hasComma = trimmed.includes(",");

  // Both separators → last one is decimal
  if (hasDot && hasComma) {
    if (trimmed.lastIndexOf(",") > trimmed.lastIndexOf(".")) {
      // "1.500,50" → Latin format
      return parseFloat(trimmed.replace(/\./g, "").replace(",", "."));
    }
    // "1,500.50" → US format
    return parseFloat(trimmed.replace(/,/g, ""));
  }

  // Only dots: "50.000" → thousands if 3 digits after last dot
  if (hasDot) {
    const afterLast = trimmed.split(".").pop()!;
    if (afterLast.length === 3) {
      return parseFloat(trimmed.replace(/\./g, ""));
    }
    return parseFloat(trimmed);
  }

  // Only commas: "50,000" → thousands if 3 digits after last comma
  if (hasComma) {
    const afterLast = trimmed.split(",").pop()!;
    if (afterLast.length === 3) {
      return parseFloat(trimmed.replace(/,/g, ""));
    }
    // "50,5" → decimal
    return parseFloat(trimmed.replace(",", "."));
  }

  return parseFloat(trimmed);
}

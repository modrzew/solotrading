export type FYType = "jan-dec" | "jul-jun";

export function getFYRange(
  type: FYType,
  date: Date = new Date(),
): { start: Date; end: Date } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed

  if (type === "jan-dec") {
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31, 23, 59, 59, 999),
    };
  }

  // jul-jun: FY starts July 1
  if (month >= 6) {
    // Jul-Dec → FY starts this year
    return {
      start: new Date(year, 6, 1),
      end: new Date(year + 1, 5, 30, 23, 59, 59, 999),
    };
  }
  // Jan-Jun → FY started last year
  return {
    start: new Date(year - 1, 6, 1),
    end: new Date(year, 5, 30, 23, 59, 59, 999),
  };
}

export function getFYLabel(type: FYType, date: Date = new Date()): string {
  const { start, end } = getFYRange(type, date);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  if (startYear === endYear) return `FY ${startYear}`;
  return `FY ${startYear}/${String(endYear).slice(2)}`;
}

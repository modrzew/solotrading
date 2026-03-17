export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  {
    code: "AUD",
    symbol: "$",
    flag: "\u{1F1E6}\u{1F1FA}",
    name: "Australian Dollar",
  },
  { code: "USD", symbol: "$", flag: "\u{1F1FA}\u{1F1F8}", name: "US Dollar" },
  { code: "EUR", symbol: "\u20AC", flag: "\u{1F1EA}\u{1F1FA}", name: "Euro" },
  {
    code: "GBP",
    symbol: "\u00A3",
    flag: "\u{1F1EC}\u{1F1E7}",
    name: "British Pound",
  },
  {
    code: "NZD",
    symbol: "$",
    flag: "\u{1F1F3}\u{1F1FF}",
    name: "New Zealand Dollar",
  },
  {
    code: "CAD",
    symbol: "$",
    flag: "\u{1F1E8}\u{1F1E6}",
    name: "Canadian Dollar",
  },
  {
    code: "JPY",
    symbol: "\u00A5",
    flag: "\u{1F1EF}\u{1F1F5}",
    name: "Japanese Yen",
  },
  {
    code: "CHF",
    symbol: "CHF",
    flag: "\u{1F1E8}\u{1F1ED}",
    name: "Swiss Franc",
  },
  {
    code: "SGD",
    symbol: "$",
    flag: "\u{1F1F8}\u{1F1EC}",
    name: "Singapore Dollar",
  },
  {
    code: "HKD",
    symbol: "$",
    flag: "\u{1F1ED}\u{1F1F0}",
    name: "Hong Kong Dollar",
  },
];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
}

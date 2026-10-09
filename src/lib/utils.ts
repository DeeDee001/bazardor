// Bengali digit map
const bengaliDigits: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Converts English numbers or number strings to Bengali numerals.
 * Example: 148 -> "১৪৮", 2.1 -> "২.১", "1,850" -> "১,৮৫০"
 */
export function toBengaliDigits(input: number | string | undefined | null): string {
  if (input === undefined || input === null) return "";
  const str = input.toString();
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[digit] || digit);
}

/**
 * Formats a numeric price into Bengali format with currency symbol.
 * Example: 148 -> "১৪৮ টাকা"
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(Number(price))) return "০ টাকা";
  const num = Math.round(Number(price));
  const formattedWithCommas = num.toLocaleString("en-US");
  return `${toBengaliDigits(formattedWithCommas)} টাকা`;
}

/**
 * Maps English unit strings to descriptive Bengali units.
 * Example: "kg" -> "প্রতি কেজি", "litre" -> "প্রতি লিটার", "dozen" -> "প্রতি ডজন"
 */
export function formatUnit(unit: string | undefined | null): string {
  if (!unit) return "প্রতি একক";
  const normalized = unit.toLowerCase().trim();
  switch (normalized) {
    case "kg":
      return "প্রতি কেজি";
    case "litre":
    case "liter":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
      return "প্রতি পিস";
    default:
      return `প্রতি ${normalized}`;
  }
}

/**
 * Maps English unit strings to short Bengali unit names.
 * Example: "kg" -> "কেজি", "litre" -> "লিটার", "dozen" -> "ডজন"
 */
export function formatShortUnit(unit: string | undefined | null): string {
  if (!unit) return "একক";
  const normalized = unit.toLowerCase().trim();
  switch (normalized) {
    case "kg":
      return "কেজি";
    case "litre":
    case "liter":
      return "লিটার";
    case "dozen":
      return "ডজন";
    case "piece":
      return "পিস";
    default:
      return normalized;
  }
}

/**
 * Formats percentage change with sign and Bengali digits.
 * Example: 2.1 -> "২.১%"
 */
export function formatPercentage(pct: number): string {
  const absVal = Math.abs(pct).toFixed(1);
  return `${toBengaliDigits(absVal)}%`;
}

/**
 * Formats today's date in Bengali language.
 * Example: "শুক্রবার, ৯ অক্টোবর ২০২৬"
 */
export function getBengaliDate(): string {
  const days = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const now = new Date();
  const dayName = days[now.getDay()];
  const dayNum = toBengaliDigits(now.getDate());
  const monthName = months[now.getMonth()];
  const yearNum = toBengaliDigits(now.getFullYear());

  return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
}

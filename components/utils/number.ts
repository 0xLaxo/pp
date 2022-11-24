export const DEFAULT_DECIMALS = 9;

export function parse_float_input(
  input: string,
  min: number = 0,
  max: number | null = null
): number {
  try {
    if (input) {
      let n = parseFloat(input);
      return max !== null && n > max ? max : n;
    }
  } catch (error) {}
  return min;
}

export function human_number(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: decimals,
  });
}

const en_ordinal_rules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes: any = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};
export function ordinal(number: number): string {
  const category = en_ordinal_rules.select(number);
  const suffix = suffixes[category];
  return number + suffix;
}

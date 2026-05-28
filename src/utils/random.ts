export interface WeightedItem<T> {
  value: T;
  weight: number;
}

export function weightedRandom<T>(items: WeightedItem<T>[]): T {
  if (items.length === 0) {
    throw new Error('weightedRandom: empty items');
  }
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[items.length - 1]!.value;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('pickRandom: empty items');
  }
  return items[Math.floor(Math.random() * items.length)]!;
}

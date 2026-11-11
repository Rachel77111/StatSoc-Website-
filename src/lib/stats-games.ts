export function mean(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}
export function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
export function correlation(points: { x: number; y: number }[]): number {
  const mx = mean(points.map(p => p.x)), my = mean(points.map(p => p.y));
  const numerator = points.reduce((sum, p) => sum + (p.x - mx) * (p.y - my), 0);
  const spread = Math.sqrt(points.reduce((sum, p) => sum + (p.x - mx) ** 2, 0) * points.reduce((sum, p) => sum + (p.y - my) ** 2, 0));
  return spread ? numerator / spread : 0;
}
export function sampleGold(draws: number, probability: number, random = Math.random): number {
  let gold = 0;
  for (let i = 0; i < draws; i++) if (random() < probability) gold++;
  return gold;
}

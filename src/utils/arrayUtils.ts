export function arraysHaveCommonItems<T>(a: T[], b: T[]): boolean {
  return a.some((item) => b.includes(item));
}

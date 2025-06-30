export function deepCopy<T>(originalValue: T): T {
  return JSON.parse(JSON.stringify(originalValue));
}

export function deepCopy<T>(originalValue: T): T {
  // Handle null, undefined, and primitive values
  if (originalValue === null || originalValue === undefined) {
    return originalValue;
  }

  // Handle primitive types that don't need deep copying
  if (typeof originalValue !== "object") {
    return originalValue;
  }

  // Handle Date objects
  if (originalValue instanceof Date) {
    return new Date(originalValue.getTime()) as T;
  }

  // Handle arrays
  if (Array.isArray(originalValue)) {
    return originalValue.map((item) => deepCopy(item)) as T;
  }

  // Handle objects
  try {
    return JSON.parse(JSON.stringify(originalValue));
  } catch (_error) {
    // Fallback for objects that can't be serialized
    const copy = {} as T;
    for (const key in originalValue) {
      if (originalValue.hasOwnProperty(key)) {
        try {
          copy[key] = deepCopy(originalValue[key]);
        } catch {
          // Skip properties that can't be copied
          copy[key] = originalValue[key];
        }
      }
    }
    return copy;
  }
}

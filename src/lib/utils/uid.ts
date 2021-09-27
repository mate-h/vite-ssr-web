/** Generate a random id for use in HTML elements */
export function uid(): string {
  return Math.random().toString(36).substr(2, 9);
}

/** Generate a base62 string with sufficient length to avoid collisions */
export function base62(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Generate a random string with sufficient length to avoid collisions */
export function id(length: number = 9): string {
  return base62(length);
}
export function classes(...classes: (string|boolean|undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
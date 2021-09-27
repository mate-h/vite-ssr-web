import { classes } from "./classes";

export function Nav({ class: c }: { class?: string } = {}) {
  return /*html*/ `
  <a href="/admin" class="${classes(
    c,
    "text-base font-medium text-black hover:text-opacity-60"
  )}">Admin</a>
  `;
}
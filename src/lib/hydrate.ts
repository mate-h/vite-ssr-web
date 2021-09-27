
export function onMount(mounted: () => void) {
  if (!import.meta.env.SSR) {
    requestAnimationFrame(mounted);
  }
}
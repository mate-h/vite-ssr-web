import { classes } from "./classes";
import { onMount } from "./hydrate";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { uid } from "./utils/uid";

type Props = { open: boolean; onClose: () => void, first?: boolean }

export function MobileMenu({ open, onClose, first }: Props) {
  // hide component SSR
  let style = "";
  if (import.meta.env.SSR) style = "display: none";

  // Mobile menu, show/hide based on menu open state.

  //   Entering: "duration-150 ease-out"
  //     From: "opacity-0 scale-95"
  //     To: "opacity-100 scale-100"
  //   Leaving: "duration-100 ease-in"
  //     From: "opacity-100 scale-100"
  //     To: "opacity-0 scale-95"
  const transitionIn = ["opacity-100", "scale-100", "duration-150", "ease-out"];
  const transitionOut = ["opacity-0", "scale-95", "duration-100", "ease-in"];

  const id = uid();
  onMount(() => {
    const menu = document.getElementById(`button-${id}`) as HTMLDivElement;
    menu.addEventListener("click", () => {
      onClose();
    });

    // click away listener
    // document.addEventListener("click", (event) => {
    //   if (event.target !== root) {
    //     onClose();
    //   }
    // });

    const root = document.getElementById(`root-${id}`) as HTMLDivElement;
    // in transition
    // console.log(open);
    if (open) {
      if (root.style.display === "none") root.style.display = "";
      root.classList.remove(...transitionOut);
      root.classList.add(...transitionIn);
    } else if (!first) {
      root.classList.remove(...transitionIn);
      root.classList.add(...transitionOut);
      setTimeout(() => {
        root.style.display = "none";
      }, 100);
    }
    if (first && !open) {
      root.style.display = "none";
    }
  });

  return /*html*/ `
  <div style="${style}" id="root-${id}" class="${classes(
    "absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden",
    open && transitionOut.slice(0, 2).join(" "),
    !open && transitionIn.slice(0, 2).join(" ")
  )}">
    <div class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="px-5 pt-4 flex items-center justify-between">
        ${Logo()}
        <div class="-mr-2">
          <button id="button-${id}" type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-600">
            <span class="sr-only">Close menu</span>
            <!-- Heroicon name: outline/x -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div class="pt-5 pb-6">
        <div class="px-2 space-y-1">
          ${Nav({ class: "block px-3 py-2 rounded-md hover:bg-gray-50" })}
        </div>
        <div class="mt-6 px-5">
          <a href="/signin" class="block text-center w-full py-3 px-4 rounded-md shadow bg-brand-600 text-white font-medium hover:bg-brand-700">Sign up</a>
        </div>
        <div class="mt-6 px-5">
          <p class="text-center text-base font-medium text-gray-500">Existing customer? <a href="/signin" class="text-gray-900 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  </div>
  `;
}
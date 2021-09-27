import { AdminNav } from "./admin-nav";
import { classes } from "./classes";
import { onMount } from "./hydrate";
import { Logo } from "./logo";
import { PageProps } from "./types";
import { uid } from "./utils/uid";

// hash navigation for large, fullscreen modals, interruptive modals, etc.
// or for when you want to navigate away from the modal

// button.addEventListener("click", () => {
//   console.log("click");
//   if (open) {
//     window.location.hash = "";
//   } else {
//     window.location.hash = "#modalid";
//   }
// });
// window.addEventListener("hashchange", () => {
//   if (window.location.hash === "#modalid") {
//     onChange(true);
//   } else {
//     onChange(false);
//   }
// });

type Props = {
  first?: boolean;
  open: boolean;
  onClose: () => void;
  pageProps: PageProps;
}

export function OverflowMenu({pageProps, first, open, onClose}: Props) {
  const id = uid();
  onMount(() => {
    const dialog = document.getElementById(`overflow-menu-${id}`) as HTMLDivElement;
    const overlay = document.getElementById(`overlay-${id}`) as HTMLDivElement;
    const close = document.getElementById(`close-${id}`) as HTMLButtonElement;
    close.addEventListener("click", onClose);
    if (open) {
      dialog.style.display = "";
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-100");
    } else {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
    } 
    if (first && !open) {
      dialog.style.display = "none";
    }
  });
  return /*html*/ `
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  <div style="display: none" id="overflow-menu-${id}" class="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
    <!--
      Off-canvas menu overlay, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div id="overlay-${id}" class="${classes(
      "fixed inset-0 bg-gray-600 bg-opacity-75 ease-linear duration-300",
      open ? "opacity-100" : "opacity-0"
    )}" aria-hidden="true"></div>

    <!--
      Off-canvas menu, show/hide based on off-canvas menu state.

      Entering: "transition ease-in-out duration-300 transform"
        From: "-translate-x-full"
        To: "translate-x-0"
      Leaving: "transition ease-in-out duration-300 transform"
        From: "translate-x-0"
        To: "-translate-x-full"
    -->
    <div class="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
      <!--
        Close button, show/hide based on off-canvas menu state.

        Entering: "ease-in-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in-out duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <button id="close-${id}" type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span class="sr-only">Close sidebar</span>
          <!-- Heroicon name: outline/x -->
          <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-shrink-0 px-4 flex items-center">
        ${Logo({class: "hover:text-brand-800 transition-all cursor-pointer"})}
      </div>
      <div class="mt-5 flex-1 h-0 overflow-y-auto">
        ${AdminNav({ pageProps, class: "px-2 space-y-1", itemClass: "text-base" })}
      </div>
    </div>

    <div class="flex-shrink-0 w-14">
      <!-- Dummy element to force sidebar to shrink to fit close icon -->
    </div>
  </div>
  `;
}

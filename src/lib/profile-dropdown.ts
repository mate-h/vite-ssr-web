import { onMount } from "./hydrate";
import { uid } from "./utils/uid";

export function ProfileDropdown() {
  // Dropdown menu, show/hide based on menu state.

  //   Entering: "transition ease-out duration-100"
  //     From: "transform opacity-0 scale-95"
  //     To: "transform opacity-100 scale-100"
  //   Leaving: "transition ease-in duration-75"
  //     From: "transform opacity-100 scale-100"
  //     To: "transform opacity-0 scale-95"
  const style = "display: none";
  const transitionIn = ["opacity-100", "scale-100", "duration-150", "ease-out"];
  const transitionOut = ["opacity-0", "scale-95", "duration-100", "ease-in"];

  let open = false;
  const id = uid();
  onMount(() => {
    open = window.location.hash === "#profile";
    const menuElement = document.getElementById(`menu-${id}`) as HTMLDivElement;
    menuElement.classList.add(...transitionOut);
    function onChange(value: boolean) {
      // mutate state
      open = value;
      requestAnimationFrame(() => {
        if (open) {
          if (menuElement.style.display === "none") {
            menuElement.style.display = "";
          }
          requestAnimationFrame(() => {
            menuElement.classList.remove(...transitionOut);
            menuElement.classList.add(...transitionIn);
          });
        } else if (!open) {
          menuElement.classList.remove(...transitionIn);
          menuElement.classList.add(...transitionOut);
          setTimeout(() => {
            menuElement.style.display = "none";
          }, 100);
        }
      });
    }
    const button = document.getElementById(id) as HTMLButtonElement;
    button.addEventListener("click", () => {
      onChange(!open);
    });
  });
  return /*html*/`
  <!-- Profile dropdown -->
  <div class="ml-3 relative">
    <div>
      <button id="${id}" type="button" class="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700" aria-expanded="false" aria-haspopup="true">
        <span class="sr-only">Open user menu</span>
        <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
      </button>
    </div>
    <div style="${style}" id="menu-${id}" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="${id}" tabindex="-1">
      <!-- Active: "bg-gray-100", Not Active: "" -->
      <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>

      <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>

      <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
    </div>
  </div>
  `;
}
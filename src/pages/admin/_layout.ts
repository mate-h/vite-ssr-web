import { AdminNav } from "lib/admin-nav";
import { onMount } from "lib/hydrate";
import { Logo } from "lib/logo";
import { OverflowMenu } from "lib/overflow-menu";
import { ProfileDropdown } from "lib/profile-dropdown";
import { PageProps } from "lib/types";
import { uid } from "lib/utils/uid";

export function Layout({children = "", pageProps}: {children?: string, pageProps: PageProps}) {
  // server rendered modal with hash navigation
  let open = pageProps?.urlParsed.hash === "#menu";
  const id = uid();
  function onChange(state: boolean) {
    open = state;
    const menuContainer = document.getElementById(
      `menu-container-${id}`
    ) as HTMLDivElement;
    menuContainer.innerHTML = OverflowMenu({
      pageProps,
      open,
      onClose: () => window.location.hash = "",
    });
  }
  onMount(() => {
    // required because pageProps?.urlParsed.hash === "#menu" is never true
    // because pageProps?.urlParsed.hash is null
    if (window.location.hash === "#menu") {
      requestAnimationFrame(() => onChange(true));
    }

    const menu = document.getElementById(`menu-${id}`) as HTMLButtonElement;
    menu.addEventListener("click", () => {
      const newState = !open;
      if (newState) {
        window.location.hash = "#menu";
      } else {
        window.location.hash = "";
      }
    });
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#menu") {
        onChange(true);
      } else {
        onChange(false);
      }
    });
  });
  
  return /*html*/`
<div class="h-screen bg-white overflow-hidden flex">
  <div id="menu-container-${id}">
    ${OverflowMenu({ pageProps, first: true, open, onClose: () => window.location.hash = "" })}
  </div>

  <!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="w-64 flex flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="border-r border-gray-200 pt-5 pb-4 flex flex-col flex-grow overflow-y-auto">
        <div class="flex-shrink-0 px-4 flex items-center">
          ${Logo({class: "hover:text-brand-800 transition-all cursor-pointer"})}
        </div>
        <div class="flex-grow mt-5 flex flex-col">
          ${AdminNav({ pageProps, class: "flex-1 bg-white px-2 space-y-1", itemClass: "text-sm" })}
        </div>
      </div>
    </div>
  </div>
  <div class="flex-1 max-w-4xl mx-auto w-0 flex flex-col md:px-8 xl:px-0">
    <div class="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex">
      <button id="menu-${id}" type="button" class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-700 md:hidden">
        <span class="sr-only">Open sidebar</span>
        <!-- Heroicon name: outline/menu-alt-2 -->
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <div class="flex-1 flex justify-between px-4 md:px-0">
        <div class="flex-1 flex">
          <form class="w-full flex md:ml-0" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="relative w-full text-gray-400 focus-within:text-gray-600">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <!-- Heroicon name: solid/search -->
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input id="search-field" class="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search">
            </div>
          </form>
        </div>
        <div class="ml-4 flex items-center md:ml-6">
          <button type="button" class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700">
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: outline/bell -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          ${ProfileDropdown()}
        </div>
      </div>
    </div>

    <main class="flex-1 relative overflow-y-auto focus:outline-none">
      ${children}
    </main>
  </div>
</div>
  `;
}
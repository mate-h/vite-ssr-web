import { Footer } from "lib/footer";
import { onMount } from "lib/hydrate";
import { Logo } from "lib/logo";
import { MobileMenu } from "lib/mobile-menu";
import { Nav } from "lib/nav";
import { uid } from "lib/utils/uid";
import background from "./background.svg";

export { Page };

function SignupForm() {
  const id = uid();
  onMount(() => {
    const form = document.getElementById(id) as HTMLFormElement;
    if (form) {
      // add event listener
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const email = formData.get("email");
        window.location.href = `/signin?email=${email}`;
      });
    }
  });
  return /*html*/`
  <form id="${id}" action="#" class="sm:max-w-xl sm:mx-auto lg:mx-0">
    <div class="sm:flex">
      <div class="min-w-0 flex-1">
        <label for="email" class="sr-only">Email address</label>
        <input name="email" id="email" type="email" placeholder="Enter your email" class="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700 focus:ring-offset-brand-500">
      </div>
      <div class="mt-3 sm:mt-0 sm:ml-3">
        <button type="submit" class="block w-full py-3 px-4 rounded-md shadow bg-brand-700 text-white font-medium hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700 focus:ring-offset-brand-500">Sign up</button>
      </div>
    </div>
    <p class="mt-3 text-sm text-black text-opacity-60 sm:mt-4">Sign up for free to continue. By providing your email, you agree to our <a href="#" class="font-medium text-black">terms or service</a>.</p>
  </form>
  `;
}

// landing page
function Page() {
  let open = false;
  const id = uid();
  function onChange(state: boolean) {
    open = state;
    const menuContainer = document.getElementById(
      `menu-container-${id}`
    ) as HTMLDivElement;
    menuContainer.innerHTML = MobileMenu({
      open,
      onClose: () => onChange(false),
    });
  }
  onMount(() => {
    const menu = document.getElementById(`menu-${id}`) as HTMLButtonElement;
    menu.addEventListener("click", () => {
      onChange(!open);
    });
  });

  return /*html*/ `
<div class="min-h-screen">
  <div class="relative overflow-hidden">
    <header class="relative">
      <div class="bg-brand-400 pt-6">
        <nav class="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6" aria-label="Global">
          <div class="flex items-center flex-1">
            <div class="flex items-center justify-between w-full md:w-auto">
              ${Logo()}
              <div class="-mr-2 flex items-center md:hidden">
                <button id="menu-${id}" type="button" class="bg-brand-700 rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-brand-900 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white" aria-expanded="false">
                  <span class="sr-only">Open main menu</span>
                  <!-- Heroicon name: outline/menu -->
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="hidden space-x-8 md:flex md:ml-10">
              ${Nav()}
            </div>
          </div>
          <div class="hidden md:flex md:items-center md:space-x-6">
            <a href="/signin" class="text-base font-medium text-black hover:text-opacity-60">
              Sign in
            </a>
            <a href="/signin" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-700 hover:bg-brand-800">
              Sign up
            </a>
          </div>
        </nav>
      </div>

      <div id="menu-container-${id}">
        ${MobileMenu({ first: true, open, onClose: () => onChange(false) })}
      </div>
    </header>

    <main>
      <div class="pt-10 bg-brand-400 sm:pt-16 lg:pt-8 lg:pb-14 overflow-hidden">
        <div class="mx-auto max-w-7xl lg:px-8">
          <div class="lg:grid lg:grid-cols-2 lg:gap-8">
            <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
              <div class="lg:py-24">
                <h1 class="mt-4 text-4xl tracking-tight font-extrabold text-black sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                  <span class="block">A better way to</span>
                  <span class="block text-brand-900">manage your supply chain</span>
                </h1>
                <p class="mt-3 text-base text-black text-opacity-60 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Put a strong focus on supply chain transparency, traceability and food safety. With this tool, you will be able to do callbacks efficiently, look up records based on a lot code. Reduce waste, optimize cost and lead time by keeping track of your inventory.
                </p>
                <div class="mt-10 sm:mt-12">
                  ${SignupForm()}
                </div>
              </div>
            </div>
            <div class="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
              <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                <img class="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="${background}" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      ${Footer()}
    </main>
  </div>
</div>
  `;
}

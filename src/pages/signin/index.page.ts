import { ErrorAlert } from "lib/error-alert";
import { onMount } from "lib/hydrate";
import { Loading } from "lib/loading";
import { Logo } from "lib/logo";
import { useStore } from "lib/store";
import { SuccessAlert } from "lib/success-alert";
import { uid } from "lib/utils/uid";

export { Page };

function LockIcon() {
  return /*html*/ `
  <svg class="h-5 w-5 text-brand-700 group-hover:text-brand-600" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17l-8.74228e-08-3.55271e-15c1.10457 4.82823e-08 2-.89543 2-2 1.77636e-15-1.11-.9-2-2-2l-8.74228e-08 1.77636e-15c-1.10457 4.82823e-08-2 .895431-2 2 0 0 0 0 0 0l1.95399e-14 2.14569e-07c1.66785e-07 1.10457.895431 2 2 2m6-9l-8.74228e-08 1.77636e-15c1.10457-4.82823e-08 2 .89543 2 2v10h3.55271e-15c0 1.10457-.895431 2-2 2h-12l-8.74228e-08-3.55271e-15c-1.10457-4.82823e-08-2-.895431-2-2 0 0 0 0 0 0v-10c-1.77636e-15-1.11.9-2 2-2h1v-2l5.68434e-14 7.54979e-07c-4.16963e-07-2.76142 2.23858-5 5-5l-5.96244e-08 9.76996e-15c2.76142-4.49893e-07 5 2.23858 5 5 4.26326e-14 2.54893e-07 6.39488e-14 5.00086e-07 6.75016e-14 7.54979e-07v2h1m-6-5l-1.31134e-07 3.10862e-15c-1.65685 7.24234e-08-3 1.34315-3 3 0 0 0 8.88178e-16 0 8.88178e-16v2h6v-2 0c0-1.65685-1.34315-3-3-3Z"></path></svg>
  `;
}

function Page() {
  const id = uid();
  const store = useStore();
  let loading = false;
  onMount(() => {
    const form = document.getElementById(`form-${id}`) as HTMLFormElement;
    const icon = document.getElementById(`icon-${id}`) as HTMLElement;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (loading) return;

      icon.innerHTML = Loading();
      loading = true;
      const data = new FormData(form);
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      store.dispatch("auth.signin", { email, password });
    });
    store.on("auth.signin.success", (state, event) => {
      const alertElement = document.getElementById(
        `alert-${id}`
      ) as HTMLElement;
      alertElement.innerHTML = SuccessAlert({
        message: "Login successful",
        description: /*html*/ `<input class="font-mono w-full p-2 rounded-md" value="${event.token}" />`,
        actions: [
          /*html*/ `<button id="success-${id}" type="button" class="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
            Copy
            </button>`,
        ],
        onDismiss: () => {
          alertElement.innerHTML = "";
        },
      });
      const success = document.getElementById(
        `success-${id}`
      ) as HTMLButtonElement;
      success.addEventListener("click", () => {
        const input = alertElement.querySelector("input") as HTMLInputElement;
        input.select();
        document.execCommand("copy");
      });
      handleComplete();
    });
    store.on("auth.signin.error", (state, event) => {
      const alertElement = document.getElementById(
        `alert-${id}`
      ) as HTMLElement;
      alertElement.innerHTML = ErrorAlert({ message: event.error });
      handleComplete();
    });
    function handleComplete() {
      loading = false;
      const icon = document.getElementById(`icon-${id}`) as HTMLElement;
      icon.innerHTML = LockIcon();
    }
  });
  return /*html*/ `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      ${Logo({ class: "text-brand-800" })}
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        In order to access your account, please sign in with your email and password.
      </p>
    </div>
    <form id="form-${id}" class="mt-8 space-y-6" action="/api/signin" method="POST">
      <input type="hidden" name="remember" value="true">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input id="email-${id}" name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" placeholder="Email address">
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password-${id}" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" placeholder="Password">
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-brand-800 focus:ring-brand-700 border-gray-300 rounded">
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-brand-800 hover:text-brand-700">
            Forgot your password?
          </a>
        </div>
      </div>

      <div id="alert-${id}"></div>

      <div>
        <button id="button-${id}" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-800 hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700">
          <span id="icon-${id}" class="absolute left-0 inset-y-0 flex items-center pl-3">
            ${LockIcon()}
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
</div>
  `;
}

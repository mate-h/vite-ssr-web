import { classes } from "./classes";
import { PageProps } from "./types/page";

type Props = { class?: string; itemClass?: string, pageProps: PageProps };

export function AdminNav({ class: c, itemClass, pageProps }: Props) {
  return /*html*/ `
    <nav class="${c}">
      <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
      <a href="/admin" class="${classes(
        itemClass,
        pageProps.urlParsed.pathname === "/admin" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        "group rounded-md py-2 px-2 flex items-center font-medium"
      )}">
      <!--
        Heroicon name: outline/home

        Current: "text-gray-500", Default: "text-gray-400 group-hover:text-gray-500"
      -->
      <svg class="${classes("mr-4 flex-shrink-0 h-6 w-6",
      pageProps.urlParsed.pathname === "/admin" ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
      
      )}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3l-10-9 -10 9h3v8h5Z"></path></svg>
      Dashboard
      </a>

      <a href="/admin/users" class="${classes(
        itemClass,
        pageProps.urlParsed.pathname === "/admin/users" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        "group rounded-md py-2 px-2 flex items-center font-medium"
      )}">
      <svg class="${classes("mr-4 flex-shrink-0 h-6 w-6",
      pageProps.urlParsed.pathname === "/admin/users" ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
      
      )}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 17v2h-14v-2c0 0 0-4 7-4 7 0 7 4 7 4m-3.5-9.5v0c0-1.933-1.567-3.5-3.5-3.5 -1.933 0-3.5 1.567-3.5 3.5 0 1.933 1.567 3.5 3.5 3.5l-1.5299e-07-3.55271e-15c1.933 8.4494e-08 3.5-1.567 3.5-3.5m3.44 5.5l-4.75292e-08-3.67823e-08c1.24444.96306 1.99869 2.42763 2.06 4v2h4v-2c0 0 0-3.63-6.06-4m-.94-9l6.53122e-09 3.63674e-11c-.688313-.00383272-1.36148.201955-1.93.59l7.8495e-08 1.09676e-07c1.24541 1.74012 1.24541 4.07988-1.62385e-07 5.82l-2.44434e-07-1.6684e-07c.568516.388045 1.24169.593833 1.93.59h-5.01928e-09c1.933 8.4494e-08 3.5-1.567 3.5-3.5 8.4494e-08-1.933-1.567-3.5-3.5-3.5Z" fill="currentColor"></path></svg>
      Users
      </a>
    </nav>
  `;
}

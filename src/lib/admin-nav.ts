import { classes } from "./classes";
import { html } from "./render";
import { PageProps } from "./types/page";
import { Icon } from "./icon";

type Props = { class?: string; itemClass?: string; pageProps: PageProps };

export function AdminNav({ class: c, itemClass, pageProps }: Props) {
  return html`
    <nav class="${classes(c)}">
      <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
      <a
        href="/admin"
        class="${classes(
          itemClass,
          pageProps.urlParsed.pathname === "/admin"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          "group rounded-md py-2 px-2 flex items-center font-medium"
        )}"
      >
        ${Icon({
          name: "house",
          class: classes(
            "mr-4 flex-shrink-0 w-6 flex justify-center text-base",
            pageProps.urlParsed.pathname === "/admin"
              ? "text-gray-500"
              : "text-gray-400 group-hover:text-gray-500"
          ),
        })}
        Dashboard
      </a>

      <a
        href="/admin/users"
        class="${classes(
          itemClass,
          pageProps.urlParsed.pathname === "/admin/users"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          "group rounded-md py-2 px-2 flex items-center font-medium"
        )}"
      >
      ${Icon({
        name: "person",
        class: classes(
          "mr-4 flex-shrink-0 w-6 flex justify-center text-base",
          pageProps.urlParsed.pathname === "/admin/users"
            ? "text-gray-500"
            : "text-gray-400 group-hover:text-gray-500"
        ),
      })}
        Users
      </a>
    </nav>
  `;
}

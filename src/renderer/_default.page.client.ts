import { getPage } from "vite-plugin-ssr/client";
import type { PageContext } from "lib/types/page";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/types";
import { createStore } from "lib/store";
import { fromContext } from "./context";

hydrate();

async function hydrate() {
  // For Client Routing we should use `useClientRouter()` instead of `getPage()`.
  // See https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>();
  const { Page } = pageContext;
  const pageProps = fromContext(pageContext);
  // only import the styles in development mode
  // if (process.env.NODE_ENV === "development") {
  //   await import("./style.css");
  // }

  createStore();

  const app = document.getElementById("page-view");
  if (app) {
    // hydrate the page
    app.innerHTML = Page(pageProps);
  }
}

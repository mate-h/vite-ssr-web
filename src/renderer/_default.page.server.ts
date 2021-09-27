import { escapeInject as html, dangerouslySkipEscape } from "vite-plugin-ssr";
import type { PageContext } from "lib/types";
import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
import { createStore } from "lib/store";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import logoUrl from "./favicon.svg";
import style from "./style.css";
import tailwindConfig from "./tailwind.config";
import { fromContext } from "./context";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname", "urlParsed"];

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page } = pageContext;
  const pageProps = fromContext(pageContext);
  createStore();
  const pageHtml = Page(pageProps);

  // See https://vite-plugin-ssr.com/html-head
  const { documentProps } = pageContext;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const desc = (documentProps && documentProps.description) || "App using Vite + vite-plugin-ssr";

  // to inline the CSS on the server side
  // may be a performance bottleneck
  let inlineCss = "";
  // if (process.env.NODE_ENV === "production") {
    inlineCss = await postcss([
      // @ts-ignore
      tailwindcss(tailwindConfig), 
      autoprefixer()
    ]).process(style).css;
  // }

  const documentHtml = html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />

        <title>${title}</title>

        <style>${dangerouslySkipEscape(inlineCss)}</style>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
  
  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}

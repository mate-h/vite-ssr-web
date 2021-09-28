import { escapeInject as html, dangerouslySkipEscape } from "vite-plugin-ssr";
import type { PageContext } from "lib/types/page";
import type { PageContextBuiltIn } from "vite-plugin-ssr/types";
import { createStore } from "lib/store";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import logoUrl from "./favicon.svg";
import style from "./style.css";
import tailwindConfig from "./tailwind.config";
import { fromContext } from "./context";
import { renderMetatags } from "./meta";
import { WebPage } from "schema-dts";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname", "urlParsed"];

const defaultDocumentProps: WebPage = {
  '@type': 'WebPage',
  headline: "Vite SSR App",
  description: "Vite SSR App",
  url: "https://vite-plugin-ssr.com",
  image: "https://vite-plugin-ssr.com/logo.png",
}

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, documentProps } = pageContext;
  const pageProps = fromContext(pageContext);
  createStore();
  const pageHtml = Page(pageProps);

  // See https://vite-plugin-ssr.com/html-head
  // to inline the CSS on the server side
  // may be a performance bottleneck
  const inlineCss = await postcss([
    // @ts-ignore
    tailwindcss(tailwindConfig), 
    autoprefixer()
  ]).process(style).css;

  let metaTags = renderMetatags(documentProps || defaultDocumentProps);
  const lang = pageContext.locale.tag.language();
  const documentHtml = html`<!DOCTYPE html>
    <html lang="${lang}">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        ${dangerouslySkipEscape(metaTags)}
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

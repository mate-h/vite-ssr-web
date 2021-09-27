import { UrlParsed } from "vite-plugin-ssr/shared/utils";

export type PageProps = {
  is404?: boolean;
  urlPathname: string;
  urlParsed: UrlParsed;
};
// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  Page: (pageProps: PageProps) => string;
  pageProps: PageProps;
  urlPathname: string;
  urlParsed: UrlParsed;
  documentProps?: {
    title?: string;
    description?: string;
  };
};

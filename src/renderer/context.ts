import { PageContext, PageProps } from "lib/types/page";

export function fromContext(context: PageContext): PageProps {
  const {pageProps, urlParsed, urlPathname} = context;
  return {
    ...pageProps,
    urlParsed,
    urlPathname,
  };
}
import { PageProps } from "lib/types/page";

export { Page };

function Page(pageProps: PageProps) {
  let message = "Error";
  if (pageProps.is404) {
    message = "404 Not Found";
  }
  return /*html*/`
    <div>
      <h1>${message}</h1>
      <p>
        <a href="/">Go home</a>
      </p>
    </div>
  `
}
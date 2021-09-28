import express, { Response } from "express";
import { createPageRenderer } from "vite-plugin-ssr";
import config from "../../vite.config";
import { localeMiddleware, LocaleParams } from "./locale";
import { themeMiddleware, ThemeParams } from "./theme";

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

type Params = ThemeParams & LocaleParams;

async function startServer() {
  const app = express();

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/../dist/client`));
  } else {
    const vite = require("vite");
    viteDevServer = await vite.createServer({
      ...config,
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  // middleware
  app.use(themeMiddleware);
  app.use(localeMiddleware);

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
  app.get("*", async (req, res: Response<any, Params>, next) => {
    let url = req.originalUrl;
    if (res.locals.urlWithoutLocale) {
      url = res.locals.urlWithoutLocale;
    }
    const pageContextInit = {
      url,
      theme: res.locals.theme,
      locale: res.locals.locale,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    res.status(httpResponse.statusCode).send(httpResponse.body);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

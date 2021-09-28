import express from "express";
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
  app.get<any, any, any, any, any, Params>("*", async (req, res, next) => {
    console.log(res.locals);
    const url = req.originalUrl;
    const pageContextInit = {
      url,
      theme: req.params.theme,
    };
    const pageContext = await renderPage(pageContextInit);
    //console.log(pageContext);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    res.status(httpResponse.statusCode).send(httpResponse.body);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

import { NextFunction, Request, Response } from "express";

export type ThemeParams = {
  theme: "light"|"dark";
}

// theme middleware
export const themeMiddleware = (req: Request, res: Response<any, ThemeParams>, next: NextFunction) => {
  // override from query string
  const { theme } = req.query;

  // Set response headers
  res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
  // Append to "Sec-CH-Prefers-Color-Scheme" to the "Vary" header
  const varyHeader = res.get("Vary");
  res.set("Vary", varyHeader ? `${varyHeader}, Sec-CH-Prefers-Color-Scheme` : "Sec-CH-Prefers-Color-Scheme");
  res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");

  const themeHeader = req.get("Sec-CH-Prefers-Color-Scheme");
  // Add param to request context
  if (typeof theme === "string" && ["dark", "light"].includes(theme)) {
    // @ts-ignore
    res.locals.theme = theme;
  } else if (typeof themeHeader === "string" && ["dark", "light"].includes(themeHeader)) {
    // @ts-ignore
    res.locals.theme = themeHeader;
  } else {
    res.locals.theme = "light";
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`theme: ${res.locals.theme}`);
  }
  next();
}
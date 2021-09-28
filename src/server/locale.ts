import { NextFunction, Request, Response } from "express";
import { supportedLocales } from "../lib/locale/supported";
import { LocaleMatcher, Locale, CLDRFramework } from "@phensley/cldr";
import { territoryAlias } from "../gen/alias";

export const localeMatcherAll = new LocaleMatcher(CLDRFramework.availableLocales(), { resolve: false });
export const localeMatcher = new LocaleMatcher(supportedLocales);

function resolveTld(req: Request): string|undefined {
  const tld = req.get("host");
  if (tld) {
    const idx = tld.lastIndexOf(".");
    if (idx > 0) {
      return tld.substring(idx + 1);
    }
    return tld;
  }
  return;
}

function resolveLocaleTld(req: Request): Locale|undefined {
  const tld = resolveTld(req);
  if (tld) {
    const locale = Locale.resolve(`und-${tld}`);
    const resolvedRegion = locale.tag.region();
    
    // whether the resolved region is matched the TLD
    let resolvedMatch = resolvedRegion === tld;

    // accommodate for deprecated region codes
    const resolvedAliasEntry = territoryAlias[tld];
    if (resolvedAliasEntry) {
      // find resolvedRegion in the alias list
      const resolvedRegionAlias = resolvedAliasEntry.find(
        alias => alias.toUpperCase() === resolvedRegion
      );
      if (resolvedRegionAlias) {
        // UK -> GB
        resolvedMatch = true;
      }
    }
    if (resolvedMatch) {
      return locale;
    }
  }
  return;
}

function parseAcceptLanguage(req: Request): string[] {
  const acceptLanguage = req.get("accept-language");
  if (acceptLanguage) {
    return acceptLanguage.split(",").map(lang => lang.split(";")[0]);
  }
  return [];
}

export type LocaleParams = {
  /** The matched supported locale */
  locale: Locale;
  /** The url which has been strippped of the locale segment */
  urlWithoutLocale: string;
};

/**
 * Locale middleware adds the locale to the request object params.
 *
 * @returns {RequestHandler} The middleware function
 */
export function localeMiddleware(
  req: Request,
  res: Response<any, LocaleParams>,
  next: NextFunction
): void {
  const url = req.originalUrl;

  // match the query param ?lang=<locale>
  const lang = req.query.lang;
  if (lang) {
    const param = lang as string;
    const locale = Locale.resolve(param);
    if (locale.id === lang) {
      // res.locals.preferred = locale;
      res.locals.locale = localeMatcher.match(param).locale;
      console.log(`[locale] query param ${url} ${res.locals.locale}`);
      return next();
    }
  }

  // match the path segment
  // assumes the path is /:locale/...
  const path = url.split("/");
  if (path.length > 1) {
    const param = path[1];
    const locale = localeMatcher.match(param).locale;
    if (locale.id === param) {
      // res.locals.preferred = locale;
      res.locals.locale = locale;
      console.log(`matched locale path segment ${param}`);
      // rewrite request url by removing the locale segment
      res.locals.urlWithoutLocale = url.substring(param.length + 1);
      return next();
    }
  }

  // match the TLD based on the hostname
  let locale = resolveLocaleTld(req);
  if (locale) {
    // res.locals.preferred = locale;
    res.locals.locale = localeMatcher.match(locale.id).locale;
    console.log(`matched locale TLD ${res.locals.locale}`);
    return next();
  }

  // match the Accept-Language header
  const acceptLang = req.get("accept-language");
  if (acceptLang) {
    // parse the Accept-Language header
    // Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5
    const acceptedLanguages = parseAcceptLanguage(req);
    // const matchedPreferred = localeMatcherAll.match(acceptedLanguages);
    const mathcedLocale = localeMatcher.match(acceptedLanguages);
    if (acceptedLanguages.length > 0) {
      // res.locals.preferred = matchedPreferred.locale;
      res.locals.locale = mathcedLocale.locale;
      console.log(`matched locale Accept-Language ${res.locals.locale}`);
      return next();
    }
  }

  next();
}

import { CLDRFramework, LocaleMatch, LocaleMatcher } from '@phensley/cldr';
import mainLocales, { MainLocales } from './main-locales';

export const allLocales = CLDRFramework.availableLocales();

export const supported = allLocales.sort(l => l.id === 'en' ? -1 : 1);

export const localeMatcher = new LocaleMatcher(supported, { resolve: false });

const messageMatcher = new LocaleMatcher(mainLocales);

/** 
 * Match all supported CLDR locales.
 * Do not resolve language tags if the language is not supported by CLDR.
 * Use matchMessages for most common use cases. Only use this method for region specific
 * formatting, e.g. en-US and en-GB have different default currency formats.
 * Avoid cases where the message contains parts with mixed languages.
 * 
 * en-US  "There is 1 item in your cart."
 * 
 * ar-EG  "There is ١ item in your cart."
 */
export function matchSupported(locale: string): LocaleMatch {
  return localeMatcher.match(locale);
}

/** 
 * Match all main languages for which the application has message translations.
 * Resolves the language tag to a supported one if there are no message translations for the language. 
 */
export function matchMessages(locale: string): MainLocales {
  return messageMatcher.match(locale).locale.tag.language() as MainLocales;
}


/** 
 * Match all main languages for which the application has message translations.
 * Resolves the language tag to a supported one if there are no message translations for the language. 
 */
 export function matchMessageLocales(locale: string) {
  return messageMatcher.match(locale);
}


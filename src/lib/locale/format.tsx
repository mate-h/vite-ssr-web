import {
  buildMessageMatcher,
  parseMessagePattern,
  CLDR,
  CurrencyFormatStyleType,
  Decimal,
  DecimalConstants,
  DecimalFormatStyleType,
  DefaultMessageArgConverter,
  FormatWidthType,
  MessageArg,
  MessageNamedArgs,
  MessageEngine,
  MessageFormatFuncMap,
  PluralRules,
  ZonedDateTime,
  CurrencyType,
  TimePeriodField,
  Locale,
} from "@phensley/cldr";
import { useStoreon } from "storeon/preact";
import * as messages from "../../gen/messages";
import englishMessages from "../../gen/messages/en";
import { ComponentType } from "preact";

export const coerce = (arg: any) => {
  try {
    return new Decimal(arg);
  } catch (e) {
    return DecimalConstants.NAN;
  }
};

export type Currency = {
  amount: number;
  currencyCode: CurrencyType;
};

export type IntervalFormatStyleType = DecimalFormatStyleType;

export const formatter = (cldr: CLDR) => ({
  interval: (args: MessageArg[], options: string[]) => {
    const now = new Date();
    // a year ago
    const start = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);
    // a year from now
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365);
    // TODO: list not exhastive for possible interval glyphs
    const possibleIntervalGlyphs = [
      " – ",
      " - ",
      " 'a' ",
      " تا ",
      " ～ ",
      " ~ ",
      " 至 ",
      "–",
      "-",
      "'a'",
      "تا",
      "～",
      "~",
      "至",
    ];
    // default interval glyph is the en dash –
    const defaultIntervalGlyph = possibleIntervalGlyphs[0];
    // format to parts not reliable for intervals, so we maintain a list of possible glyphs
    // and use the first one we find
    // TODO: use a proper decimal interval format instead of date interval format, or override w/ a custom formatter
    const msg = cldr.Calendars.formatDateInterval(start, end, {
      context: "standalone",
      skeleton: "yyyy",
    });
    // console.log(msg);
    // determine the interval glyph
    let glyph = possibleIntervalGlyphs.find((glyph) => msg.includes(glyph));
    // if we didn't find a glyph, use the default glyph
    if (!glyph) {
      glyph = defaultIntervalGlyph;
    }
    // same as decimal formatter, but with the interval glyph
    const style = options[0] as DecimalFormatStyleType;
    const right = cldr.Numbers.formatDecimalToParts(coerce(args[0][1]), {
      style,
    });
    const left = cldr.Numbers.formatDecimalToParts(coerce(args[0][0]), {
      style,
    }).filter((part) => {
      return !right
        .filter((i) => i.type !== "integer")
        .some((i) => i.value === part.value);
    });

    return `${left.map((v) => v.value).join("")}${glyph}${right
      .map((v) => v.value)
      .join("")}`;
  },
  decimal: (args: MessageArg[], options: string[]) => {
    const style = options[0] as DecimalFormatStyleType;
    return cldr.Numbers.formatDecimal(coerce(args[0]), { style });
  },
  date: (args: MessageArg[], options: string[]) => {
    const width = options[0] as FormatWidthType;
    return cldr.Calendars.formatDate(args[0] as ZonedDateTime, {
      date: width,
    });
  },
  time: (args: MessageArg[], options: string[]) => {
    const width = options[0] as FormatWidthType;
    return cldr.Calendars.formatDate(args[0] as ZonedDateTime, {
      time: width,
    });
  },
  datetime: (args: MessageArg[], options: string[]) => {
    const width = options[0] as FormatWidthType;
    return cldr.Calendars.formatDate(args[0] as ZonedDateTime, {
      datetime: width,
    });
  },
  alias: (args: MessageArg[], options: string[]) => {
    const aliasName = options[0] as any;
    const message = getMessage(cldr, aliasName);
    return message;
  },
  relativetime: (args: MessageArg[], options: string[]) => {
    const field = options[0] as TimePeriodField;
    return cldr.Calendars.formatRelativeTime(
      new Date(),
      args[0] as ZonedDateTime,
      {
        field,
      }
    );
  },
  currency: (args: MessageArg[], options: string[]) => {
    const arg = args[0] as Currency;
    const style = options[0] as CurrencyFormatStyleType;
    return cldr.Numbers.formatCurrency(coerce(arg.amount), arg.currencyCode, {
      style,
    });
  },
});

const FORMATTER_NAMES = [
  "currency",
  "decimal",
  "datetime",
  "date",
  "time",
  "relativetime",
  "alias",
  "interval",
];
const MATCHER = buildMessageMatcher(FORMATTER_NAMES);
const CONVERTER = new DefaultMessageArgConverter();

const parse = (message: string) => parseMessagePattern(message, MATCHER);

const debugMode = false;

export const format = (
  plurals: PluralRules,
  formatters: MessageFormatFuncMap,
  message: string,
  positional: MessageArg[],
  named: MessageNamedArgs = {}
) => {
  const engine = new MessageEngine(
    plurals,
    CONVERTER,
    formatters,
    parse(message)
  );
  return engine.evaluate(positional, named);
};

export type MessageKey = keyof typeof englishMessages;

export type TranslateFunction = (
  id: MessageKey,
  positional?: MessageArg[],
  named?: MessageNamedArgs
) => string;

export type FormatFunction = (
  msg: string,
  positional?: MessageArg[],
  named?: MessageNamedArgs
) => string;

export function useFormat() {
  const { cldr } = useStoreon<State, Events>("cldr");
  // Fetch the PluralRules instance for the current locale
  const plurals = cldr.General.bundle().plurals();

  // Build our map of custom formatters once whenever the locale changes
  const formatters = formatter(cldr);

  // TODO: remove this
  function capitalizeFirstLetter(string: string) {
    // only capitalize the first letter for Slovak, correct in airtable later
    if (cldr.General.locale().tag.language() === "sk") {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }

  function renderTags(msg: string, named: MessageNamedArgs = {}) {
    const tags = Object.keys(named);
    if (tags.length === 0) {
      return msg;
    }
    // tags like <c>...</c> are replaced with the value of the named argument
    return msg.replace(/<[^>]*>([^<]*)<\/([^>]*)>/g, (match, text, tag) => {
      const value = named[tag];
      if (typeof value === "string") {
        return value;
      }
      const Component = value as ComponentType;
      return render(<Component>{text}</Component>, named);
    });
  }
  const t: TranslateFunction = (id, positional = [], named = {}) => {
    if (debugMode) return id;

    const message = getMessage(cldr, id);
    let result = format(plurals, formatters, message, positional, named);
    result = renderTags(result, named);
    result = capitalizeFirstLetter(result);
    return result;
  };
  const msg: FormatFunction = (msg, positional = [], named = {}) => {
    if (debugMode) return msg;

    let result = format(plurals, formatters, msg, positional, named);
    result = renderTags(result, named);
    result = capitalizeFirstLetter(result);
    return result;
  };
  if (!import.meta.env.SSR) (window as any).msg = msg;
  return {
    msg,
    t,
    cldr,
  };
}

/** Meant to be used internally in the format module */
function getMessage(cldr: CLDR, id: MessageKey) {
  const locale = cldr.General.locale();
  const bundle = (messages as any)[locale.tag.language()];
  const bundleEn = (messages as any)["en"];
  const val = bundleEn[id];
  if (!val) {
    // fail silently
    console.warn(`No message found for ${id} in ${locale.tag.language()}`);
    return "";
  }
  if (!bundle) return val;
  return bundle[id] || val;
}

/** Get the raw, unformatted message, meant to be used in a server side function */
export function getMessageRaw(landuageId: keyof typeof messages, id: MessageKey) {
  const bundle = (messages as any)[landuageId];
  const val = bundle[id];
  if (!val) {
    // fail silently
    console.warn(`No message found for ${id} in ${landuageId}`);
    return "";
  }
  return val;
}

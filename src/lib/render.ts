
/** ES6 HTML template rendering */
export function html(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((result, str, i) => {
    result += str;
    if (i < values.length) {
      result += values[i];
    }
    return result;
  }, '');
}

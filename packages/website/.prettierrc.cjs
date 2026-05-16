/**
 * https://prettier.io/docs/en/options.html#bracket-line
 * All options including default
 */
const config = {
    /* default is 80 */
    printWidth: 120,
    /* default is 2*/
    tabWidth: 4,
    /* default is false */
    useTabs: false,
    /* default is true*/
    semi: true,
    /* default is false */
    singleQuote: true,
    /* default is "as-needed" */
    quoteProps: 'as-needed',
    /* default is false */
    jsxSingleQuote: false,
    /* default is es5 */
    trailingComma: 'es5',
    /* default is true */
    bracketSpacing: true,
    /* default is false */
    bracketSameLine: false,
    /* default is always*/
    arrowParens: 'avoid',
    /* default is 0*/
    rangeStart: 0,
    /* default is Infinity */
    rangeEnd: Infinity,
    /* default is preserve */
    proseWrap: 'preserve',
    /* default is css */
    htmlWhitespaceSensitivity: 'css',
    /* default is lf */
    endOfLine: 'lf',
    /* default is auto */
    embeddedLanguageFormatting: 'auto',
    /* default is false */
    singleAttributePerLine: true,
    /* default is true */
    organizeImportsSkipDestructiveCodeActions: true,

    plugins: ['prettier-plugin-multiline-arrays', 'prettier-plugin-organize-imports'],
};

module.exports = config;

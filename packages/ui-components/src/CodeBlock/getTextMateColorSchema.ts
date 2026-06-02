import type { ThemeRegistration } from "shiki";

export const getTextMateColorSchema = (
  mode: "dark" | "light" = "dark",
): ThemeRegistration => {
  // Base colors
  const darkestBg = "#0f051d";
  const darkBg = "#1e142e";
  const neutralBg = "#332647";
  const neutralBgAlpha66 = "#33264766";

  // Foreground colors
  const white = "#ffffff";
  const lightestFg = "#faefed";
  const lightFg = "#ebdedb";
  const lightFgAlpha14 = "#ebdedb14";
  const lightFgAlpha1a = "#ebdedb1a";
  const lightFgAlpha21 = "#ebdedb21";
  const lightFgAlpha45 = "#ebdedb45";
  const neutralFg = "#a7a1b5";
  const neutralFgAlpha8a = "#a7a1b58a";
  const mutedFg = "#7b728c";
  const dimFg = "#574c6a";
  const darkFg = "#45385b";

  // Primary purple
  const purple = "#a050e6";
  const purpleAlpha33 = "#a050e633";
  const purpleAlpha45 = "#a050e645";
  const purpleAlpha54 = "#a050e654";
  const purpleAlpha66 = "#a050e666";
  const purpleAlphaAb = "#a050e6ab";
  const darkPurple = "#7025aa";
  const darkPurpleAlpha45 = "#7025aa45";
  const darkPurpleAlphaAb = "#7025aaab";
  const darkPurpleAlphaDe = "#7025aade";
  const purpleBadge = "#31184899";

  // Blue
  const blue = "#4c7df7";
  const blueAlpha1f = "#4c7df71f";
  const blueAlpha26 = "#4c7df726";
  const blueAlpha33 = "#4c7df733";
  const blueAlpha40 = "#4c7df740";
  const blueAlpha45 = "#4c7df745";
  const blueAlpha4c = "#4c7df74c";
  const blueAlpha54 = "#4c7df754";
  const darkBlue = "#2247af";
  const darkBlueAlpha5c = "#2247af5c";

  // Cyan/Teal
  const cyan = "#51cec7";
  const cyanAlpha26 = "#51cec726";
  const cyanAlpha40 = "#51cec740";
  const teal = "#60ddc0";
  const tealAlpha1f = "#60ddc01f";
  const lightCyan = "#76efe7";
  const darkTeal = "#00928c";
  const darkTealAlpha45 = "#00928c45";
  const brightCyan = "#32d8ff";

  // Green
  const green = "#00b667";
  const greenAlpha1f = "#00b6671f";
  const greenAlpha26 = "#00b66726";
  const greenAlpha40 = "#00b66740";
  const greenAlpha66 = "#00b66766";
  const darkGreen = "#007d33";

  // Yellow/Orange
  const yellow = "#f7be2b";
  const yellowAlpha1f = "#f7be2b1f";
  const orange = "#ef8c24";
  const orangeAlpha87 = "#ef8c2487";
  const orangeAlphaB0 = "#ef8c24b0";
  const orangeAlphaCc = "#ef8c24cc";
  const darkOrange = "#af5600";

  // Red/Pink
  const red = "#f2396d";
  const redAlpha21 = "#f2396d21";
  const redAlpha40 = "#f2396d40";
  const darkRed = "#b70045";
  const pink = "#ee8ab2";
  const darkPink = "#b64e7c";

  // Special backgrounds
  const darkestBgAlpha4a = "#0f051d4a";
  const redBg = "#4d1221";
  const orangeBg = "#4d2c0e";
  const shadowBlack = "#00000033";

  const colorSchema: ThemeRegistration = {
    name: "parallax",
    displayName: "Parallax",
    type: "dark",
    colors: {
      "activityBar.background": darkestBg,
      "activityBar.border": darkestBg,
      "activityBar.inactiveForeground": dimFg,
      "activityBarBadge.background": purple,
      "activityBarBadge.foreground": white,
      "activityBarTop.foreground": neutralFg,
      "activityBarTop.inactiveForeground": dimFg,
      "badge.background": purpleBadge,
      "badge.foreground": lightFg,
      "breadcrumb.activeSelectionForeground": lightFg,
      "breadcrumb.background": darkestBg,
      "breadcrumb.foreground": neutralFg,
      "breadcrumbPicker.background": darkestBg,
      "button.foreground": white,
      "button.hoverBackground": purpleAlphaAb,
      "button.secondaryBackground": dimFg,
      "charts.blue": blue,
      "charts.foreground": lightFg,
      "charts.green": green,
      "charts.lines": darkestBg,
      "charts.purple": purple,
      "charts.red": red,
      "charts.yellow": yellow,
      "chat.avatarBackground": darkPurple,
      "chat.avatarForeground": lightFg,
      "chat.requestBorder": darkestBg,
      "chat.slashCommandBackground": darkestBg,
      "debugConsole.errorForeground": darkRed,
      "debugConsole.infoForeground": neutralFg,
      "debugConsole.sourceForeground": neutralFg,
      "debugConsole.warningForeground": darkOrange,
      "debugConsoleInputIcon.foreground": teal,
      "debugExceptionWidget.background": darkestBg,
      "debugIcon.breakpointDisabledForeground": dimFg,
      "debugIcon.breakpointForeground": red,
      "debugIcon.breakpointUnverifiedForeground": darkRed,
      "debugTokenExpression.boolean": orange,
      "debugTokenExpression.error": darkRed,
      "debugTokenExpression.name": cyan,
      "debugTokenExpression.number": orange,
      "debugTokenExpression.string": green,
      "debugTokenExpression.value": lightFg,
      "debugView.stateLabelBackground": darkestBg,
      "debugView.valueChangedHighlight": darkPurpleAlphaAb,
      descriptionForeground: neutralFg,
      "diffEditor.diagonalFill": neutralBg,
      "diffEditor.insertedLineBackground": greenAlpha1f,
      "diffEditor.insertedTextBackground": greenAlpha1f,
      "diffEditor.removedLineBackground": redAlpha21,
      "diffEditor.removedTextBackground": redAlpha21,
      "diffEditor.unchangedCodeBackground": neutralBgAlpha66,
      "diffEditorGutter.insertedLineBackground": greenAlpha26,
      "diffEditorGutter.removedLineBackground": redAlpha21,
      "diffEditorOverview.insertedForeground": greenAlpha26,
      "diffEditorOverview.removedForeground": redAlpha21,
      disabledForeground: dimFg,
      "dropdown.background": darkestBg,
      "dropdown.listBackground": darkestBg,
      "editor.findMatchBackground": purpleAlpha66,
      "editor.findMatchBorder": yellow,
      "editor.findMatchHighlightBackground": purpleAlpha66,
      "editor.findRangeHighlightBackground": blueAlpha33,
      "editor.focusedStackFrameHighlightBackground": tealAlpha1f,
      "editor.foldBackground": darkestBgAlpha4a,
      "editor.foreground": lightFg,
      "editor.inactiveSelectionBackground": blueAlpha26,
      "editor.lineHighlightBackground": neutralBg,
      "editor.rangeHighlightBackground": blueAlpha1f,
      "editor.selectionBackground": blueAlpha4c,
      "editor.selectionHighlightBackground": blueAlpha45,
      "editor.stackFrameHighlightBackground": yellowAlpha1f,
      "editor.wordHighlightBackground": blueAlpha45,
      "editor.wordHighlightStrongBackground": blueAlpha54,
      "editorBracketHighlight.foreground1": blue,
      "editorBracketHighlight.foreground2": cyan,
      "editorBracketHighlight.foreground3": purple,
      "editorBracketHighlight.foreground4": teal,
      "editorBracketHighlight.foreground5": green,
      "editorBracketHighlight.foreground6": orange,
      "editorBracketHighlight.unexpectedBracket.foreground": red,
      "editorBracketMatch.background": darkestBg,
      "editorBracketPairGuide.activeBackground1": blue,
      "editorBracketPairGuide.activeBackground2": cyan,
      "editorBracketPairGuide.activeBackground3": purple,
      "editorBracketPairGuide.activeBackground4": teal,
      "editorBracketPairGuide.activeBackground5": green,
      "editorBracketPairGuide.activeBackground6": orange,
      "editorCodeLens.foreground": mutedFg,
      "editorCursor.foreground": lightestFg,
      "editorError.foreground": red,
      "editorGhostText.foreground": dimFg,
      "editorGroup.border": darkestBg,
      "editorGroupHeader.border": darkestBg,
      "editorGroupHeader.noTabsBackground": darkestBg,
      "editorGroupHeader.tabsBackground": darkestBg,
      "editorGroupHeader.tabsBorder": darkestBg,
      "editorGutter.deletedBackground": darkRed,
      "editorGutter.modifiedBackground": darkBlue,
      "editorHint.foreground": darkTeal,
      "editorHoverWidget.background": darkestBg,
      "editorHoverWidget.border": darkestBg,
      "editorIndentGuide.background1": darkFg,
      "editorInfo.foreground": darkTeal,
      "editorInlayHint.foreground": dimFg,
      "editorLightBulb.foreground": yellow,
      "editorLightBulbAutoFix.foreground": yellow,
      "editorLineNumber.activeForeground": neutralFg,
      "editorLineNumber.foreground": darkFg,
      "editorLink.activeForeground": teal,
      "editorMarkerNavigation.background": darkestBg,
      "editorOverviewRuler.border": darkestBg,
      "editorOverviewRuler.bracketMatchForeground": darkestBg,
      "editorOverviewRuler.errorForeground": red,
      "editorOverviewRuler.findMatchForeground": lightFgAlpha45,
      "editorOverviewRuler.infoForeground": cyan,
      "editorOverviewRuler.modifiedForeground": darkBlue,
      "editorOverviewRuler.rangeHighlightForeground": lightFgAlpha45,
      "editorOverviewRuler.selectionHighlightForeground": lightFgAlpha21,
      "editorOverviewRuler.warningForeground": orange,
      "editorOverviewRuler.wordHighlightForeground": purpleAlpha54,
      "editorOverviewRuler.wordHighlightStrongForeground": purpleAlpha66,
      "editorPane.background": darkBg,
      "editorRuler.foreground": darkestBg,
      "editorSuggestWidget.background": darkestBg,
      "editorSuggestWidget.border": darkestBg,
      "editorSuggestWidget.selectedBackground": neutralBg,
      "editorWarning.foreground": orange,
      "editorWhitespace.foreground": darkFg,
      "editorWidget.background": darkestBg,
      "editorWidget.border": darkestBg,
      "editorWidget.resizeBorder": blueAlpha33,
      errorForeground: darkRed,
      "extensionBadge.remoteBackground": darkPurple,
      "extensionBadge.remoteForeground": white,
      "extensionButton.prominentBackground": darkPurpleAlphaDe,
      "extensionButton.prominentForeground": white,
      "extensionButton.prominentHoverBackground": purpleAlphaAb,
      focusBorder: blueAlpha33,
      foreground: neutralFg,
      "gitDecoration.addedResourceForeground": green,
      "gitDecoration.conflictingResourceForeground": orangeAlphaCc,
      "gitDecoration.deletedResourceForeground": darkRed,
      "gitDecoration.ignoredResourceForeground": mutedFg,
      "gitDecoration.modifiedResourceForeground": blue,
      "gitDecoration.renamedResourceForeground": cyan,
      "gitDecoration.stageDeletedResourceForeground": darkRed,
      "gitDecoration.stageModifiedResourceForeground": blue,
      "gitDecoration.untrackedResourceForeground": green,
      "gitlens.gutterBackgroundColor": darkestBg,
      "gitlens.gutterUncommittedForegroundColor": blue,
      "gitlens.trailingLineForegroundColor": dimFg,
      "icon.foreground": neutralFg,
      "inlineChat.foreground": lightFg,
      "inlineChatDiff.inserted": greenAlpha40,
      "inlineChatDiff.removed": redAlpha40,
      "inlineChatInput.background": darkestBg,
      "input.background": darkestBg,
      "input.border": darkestBg,
      "input.placeholderForeground": neutralFgAlpha8a,
      "inputOption.activeBackground": purpleAlpha45,
      "inputOption.activeForeground": lightestFg,
      "inputValidation.errorBackground": redBg,
      "inputValidation.errorBorder": darkRed,
      "inputValidation.errorForeground": lightFg,
      "inputValidation.infoBackground": darkBlueAlpha5c,
      "inputValidation.infoBorder": darkBlue,
      "inputValidation.infoForeground": lightFg,
      "inputValidation.warningBackground": orangeBg,
      "inputValidation.warningBorder": darkOrange,
      "inputValidation.warningForeground": white,
      "list.activeSelectionBackground": neutralBg,
      "list.activeSelectionForeground": lightFg,
      "list.deemphasizedForeground": neutralFg,
      "list.dropBackground": neutralBg,
      "list.errorForeground": darkRed,
      "list.focusBackground": neutralBg,
      "list.focusForeground": lightFg,
      "list.highlightForeground": blue,
      "list.hoverBackground": darkestBg,
      "list.inactiveSelectionBackground": neutralBg,
      "list.inactiveSelectionForeground": lightFg,
      "list.invalidItemForeground": darkOrange,
      "list.warningForeground": darkOrange,
      "listFilterWidget.background": darkestBg,
      "listFilterWidget.outline": darkPurple,
      "menu.background": darkestBg,
      "menu.border": darkestBg,
      "menu.selectionBackground": neutralBg,
      "menu.selectionForeground": lightFg,
      "menu.separatorBackground": darkestBg,
      "menubar.selectionBorder": neutralBg,
      "menubar.selectionForeground": lightFg,
      "merge.currentContentBackground": darkTealAlpha45,
      "merge.currentHeaderBackground": cyanAlpha26,
      "merge.incomingContentBackground": darkPurpleAlpha45,
      "merge.incomingHeaderBackground": darkPurpleAlphaAb,
      "mergeEditor.change.background": cyanAlpha26,
      "mergeEditor.change.word.background": cyanAlpha40,
      "mergeEditor.conflict.handled.minimapOverViewRuler": green,
      "mergeEditor.conflict.handledFocused.border": greenAlpha66,
      "mergeEditor.conflict.handledUnfocused.border": greenAlpha26,
      "mergeEditor.conflict.unhandled.minimapOverViewRuler": orange,
      "mergeEditor.conflict.unhandledFocused.border": orangeAlphaB0,
      "mergeEditor.conflict.unhandledUnfocused.border": orangeAlpha87,
      "minimapGutter.addedBackground": darkGreen,
      "minimapGutter.deletedBackground": darkRed,
      "minimapGutter.modifiedBackground": darkBlue,
      "multiDiffEditor.border": darkBg,
      "multiDiffEditor.headerBackground": darkBg,
      "notebook.cellBorderColor": darkestBg,
      "notebook.cellEditorBackground": darkestBg,
      "notebook.editorBackground": darkBg,
      "notebook.focusedCellBorder": darkBlue,
      "notificationCenterHeader.background": darkestBg,
      "notifications.background": darkestBg,
      "notificationsInfoIcon.foreground": darkTeal,
      "notificationsWarningIcon.foreground": darkOrange,
      "panel.background": darkestBg,
      "panel.border": darkestBg,
      "panelInput.border": darkestBg,
      "panelTitle.activeBorder": darkestBg,
      "panelTitle.inactiveForeground": mutedFg,
      "peekView.border": darkestBg,
      "peekViewEditor.background": darkestBg,
      "peekViewResult.background": darkestBg,
      "peekViewResult.lineForeground": lightFg,
      "peekViewResult.matchHighlightBackground": purpleAlpha66,
      "peekViewResult.selectionBackground": purpleAlpha33,
      "peekViewResult.selectionForeground": lightFg,
      "peekViewTitle.background": darkestBg,
      "peekViewTitleLabel.foreground": lightFg,
      "pickerGroup.border": darkestBg,
      "progressBar.background": darkPurple,
      "sash.hoverBorder": darkBlue,
      "scmGraph.foreground1": orange,
      "scmGraph.foreground2": yellow,
      "scmGraph.foreground3": green,
      "scmGraph.foreground4": blue,
      "scmGraph.foreground5": purple,
      "scmGraph.historyItemBaseRefColor": darkPurple,
      "scmGraph.historyItemHoverAdditionsForeground": green,
      "scmGraph.historyItemHoverDefaultLabelForeground": lightFg,
      "scmGraph.historyItemHoverDeletionsForeground": red,
      "scmGraph.historyItemHoverLabelForeground": darkBg,
      "scmGraph.historyItemRefColor": darkBlue,
      "scmGraph.historyItemRemoteRefColor": green,
      "scrollbar.shadow": shadowBlack,
      "scrollbarSlider.activeBackground": lightFgAlpha21,
      "scrollbarSlider.background": lightFgAlpha14,
      "scrollbarSlider.hoverBackground": lightFgAlpha1a,
      "selection.background": blueAlpha40,
      "settings.headerForeground": blue,
      "sideBar.background": darkestBg,
      "sideBar.border": darkestBg,
      "sideBar.foreground": neutralFg,
      "sideBarSectionHeader.background": darkestBg,
      "sideBarSectionHeader.border": darkestBg,
      "sideBarTitle.foreground": neutralFg,
      "statusBar.background": darkestBg,
      "statusBar.border": darkestBg,
      "statusBar.debuggingBackground": darkestBg,
      "statusBar.foreground": neutralFg,
      "statusBar.noFolderBackground": darkestBg,
      "statusBarItem.activeBackground": darkestBg,
      "statusBarItem.prominentBackground": darkestBg,
      "tab.activeBackground": darkBg,
      "tab.activeBorder": purple,
      "tab.activeForeground": lightFg,
      "tab.activeModifiedBorder": darkBg,
      "tab.border": darkestBg,
      "tab.inactiveBackground": darkestBg,
      "tab.inactiveModifiedBorder": neutralBg,
      "tab.lastPinnedBorder": neutralBg,
      "tab.unfocusedActiveBorder": neutralBg,
      "tab.unfocusedActiveForeground": lightFg,
      "tab.unfocusedHoverForeground": lightFg,
      "tab.unfocusedInactiveForeground": neutralFg,
      "terminal.ansiBlack": darkFg,
      "terminal.ansiBlue": blue,
      "terminal.ansiBrightBlack": dimFg,
      "terminal.ansiBrightBlue": blue,
      "terminal.ansiBrightCyan": lightCyan,
      "terminal.ansiBrightGreen": green,
      "terminal.ansiBrightMagenta": purple,
      "terminal.ansiBrightRed": red,
      "terminal.ansiBrightWhite": lightestFg,
      "terminal.ansiBrightYellow": yellow,
      "terminal.ansiCyan": cyan,
      "terminal.ansiGreen": darkGreen,
      "terminal.ansiMagenta": darkPurple,
      "terminal.ansiRed": darkRed,
      "terminal.ansiWhite": lightFg,
      "terminal.ansiYellow": orange,
      "terminal.background": darkestBg,
      "terminal.selectionBackground": blueAlpha4c,
      "textBlockQuote.background": darkestBg,
      "textCodeBlock.background": darkestBg,
      "textLink.foreground": blue,
      "textPreformat.foreground": neutralFg,
      "textSeparator.foreground": darkFg,
      "titleBar.activeBackground": darkestBg,
      "titleBar.border": darkestBg,
      "titleBar.inactiveBackground": darkestBg,
      "toolbar.activeBackground": neutralBg,
      "toolbar.hoverBackground": neutralBg,
      "tree.indentGuidesStroke": darkFg,
      "walkThrough.embeddedEditorBackground": darkestBg,
      "window.activeBorder": darkestBg,
      "window.inactiveBorder": darkestBg,
    },
    tokenColors: [
      {
        scope: [
          "comment",
          "meta.var.expr storage.type",
          "keyword.control.flow",
          "keyword.control.return",
          "meta.directive.vue punctuation.separator.key-value.html",
          "meta.directive.vue entity.other.attribute-name.html",
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
          "storage.modifier",
          "string.quoted.docstring.multi",
          "string.quoted.docstring.multi.python punctuation.definition.string.begin",
          "string.quoted.docstring.multi.python punctuation.definition.string.end",
          "string.quoted.docstring.multi.python constant.character.escape",
        ],
        settings: {
          fontStyle: "italic",
        },
      },
      {
        scope: [
          "keyword.control.flow.block-scalar.literal",
          "keyword.control.flow.python",
        ],
        settings: {
          fontStyle: "",
        },
      },
      {
        scope: [
          "comment",
          "comment.block.documentation",
          "punctuation.definition.comment",
          "comment.block.documentation punctuation",
          "string.quoted.docstring.multi",
          "string.quoted.docstring.multi.python punctuation.definition.string.begin",
          "string.quoted.docstring.multi.python punctuation.definition.string.end",
          "string.quoted.docstring.multi.python constant.character.escape",
        ],
        settings: {
          foreground: mutedFg,
        },
      },
      {
        scope: [
          "keyword.operator.assignment.jsdoc",
          "comment.block.documentation variable",
          "comment.block.documentation storage",
          "comment.block.documentation keyword",
          "comment.block.documentation support",
          "comment.block.documentation markup",
          "comment.block.documentation markup.inline.raw.string.markdown",
          "meta.other.type.phpdoc.php keyword.other.type.php",
          "meta.other.type.phpdoc.php support.other.namespace.php",
          "meta.other.type.phpdoc.php punctuation.separator.inheritance.php",
          "meta.other.type.phpdoc.php support.class",
          "keyword.other.phpdoc.php",
          "log.date",
        ],
        settings: {
          foreground: dimFg,
        },
      },
      {
        scope: [
          "meta.other.type.phpdoc.php support.class",
          "comment.block.documentation storage.type",
          "comment.block.documentation punctuation.definition.block.tag",
          "comment.block.documentation entity.name.type.instance",
        ],
        settings: {
          foreground: neutralFg,
        },
      },
      {
        scope: [
          "variable.other.constant",
          "punctuation.definition.constant",
          "constant.language",
          "constant.numeric",
          "support.constant",
          "constant.other.caps",
        ],
        settings: {
          foreground: orange,
        },
      },
      {
        scope: [
          "string",
          "constant.other.symbol",
          "constant.other.key",
          "meta.attribute-selector",
          "string constant.character",
        ],
        settings: {
          fontStyle: "",
          foreground: green,
        },
      },
      {
        scope: [
          "constant.other.color",
          "constant.other.color.rgb-value.hex punctuation.definition.constant",
        ],
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: ["invalid", "invalid.illegal"],
        settings: {
          foreground: red,
        },
      },
      {
        scope: "invalid.deprecated",
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "storage.type",
        settings: {
          foreground: purple,
        },
      },
      {
        scope: ["meta.var.expr storage.type", "storage.modifier"],
        settings: {
          foreground: darkPurple,
        },
      },
      {
        scope: [
          "punctuation.definition.template-expression",
          "punctuation.section.embedded",
          "meta.embedded.line.tag.smarty",
          "support.constant.handlebars",
          "punctuation.section.tag.twig",
        ],
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: [
          "keyword.control.smarty",
          "keyword.control.twig",
          "support.constant.handlebars keyword.control",
          "keyword.operator.comparison.twig",
          "keyword.blade",
          "entity.name.function.blade",
          "meta.tag.blade keyword.other.type.php",
        ],
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: ["keyword.operator.spread", "keyword.operator.rest"],
        settings: {
          fontStyle: "bold",
          foreground: red,
        },
      },
      {
        scope: [
          "keyword.operator",
          "keyword.control.as",
          "keyword.other",
          "keyword.operator.bitwise.shift",
          "punctuation",
          "expression.embbeded.vue punctuation.definition.tag",
          "text.html.twig meta.tag.inline.any.html",
          "meta.tag.template.value.twig meta.function.arguments.twig",
          "meta.directive.vue punctuation.separator.key-value.html",
          "punctuation.definition.constant.markdown",
          "punctuation.definition.string",
          "punctuation.support.type.property-name",
          "text.html.vue-html meta.tag",
          "meta.attribute.directive",
          "punctuation.definition.keyword",
          "punctuation.terminator.rule",
          "punctuation.definition.entity",
          "punctuation.separator.inheritance.php",
          "keyword.other.template",
          "keyword.other.substitution",
          "entity.name.operator",
          "meta.property-list punctuation.separator.key-value",
          "meta.at-rule.mixin punctuation.separator.key-value",
          "meta.at-rule.function variable.parameter.url",
          "meta.embedded.inline.phpx punctuation.definition.tag.begin.html",
          "meta.embedded.inline.phpx punctuation.definition.tag.end.html",
        ],
        settings: {
          foreground: brightCyan,
        },
      },
      {
        scope: [
          "keyword.control.module.js",
          "keyword.control.import",
          "keyword.control.export",
          "keyword.control.from",
          "keyword.control.default",
          "meta.import keyword.other",
        ],
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: ["keyword", "keyword.control", "keyword.other.important"],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "keyword.other.DML",
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: [
          "keyword.operator.logical",
          "storage.type.function",
          "keyword.operator.bitwise",
          "keyword.operator.ternary",
          "keyword.operator.comparison",
          "keyword.operator.relational",
          "keyword.operator.or.regexp",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "entity.name.tag",
        settings: {
          foreground: red,
        },
      },
      {
        scope: [
          "entity.name.tag support.class.component",
          "meta.tag.custom entity.name.tag",
          "meta.tag.other.unrecognized.html.derivative entity.name.tag",
          "meta.tag",
        ],
        settings: {
          foreground: pink,
        },
      },
      {
        scope: [
          "punctuation.definition.tag",
          "text.html.php meta.embedded.block.html meta.tag.metadata.script.end.html punctuation.definition.tag.begin.html text.html.basic",
        ],
        settings: {
          foreground: darkPink,
        },
      },
      {
        scope: [
          "constant.other.php",
          "variable.other.global.safer",
          "variable.other.global.safer punctuation.definition.variable",
          "variable.other.global",
          "variable.other.global punctuation.definition.variable",
          "constant.other",
        ],
        settings: {
          foreground: yellow,
        },
      },
      {
        scope: [
          "variable",
          "support.variable",
          "string constant.other.placeholder",
          "variable.parameter.handlebars",
          "variable.other.object",
          "meta.fstring",
          "meta.function-call meta.function-call.arguments",
          "meta.embedded.inline.phpx constant.other.php",
        ],
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "meta.array.literal variable",
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: [
          "meta.object-literal.key",
          "entity.name.type.hcl",
          "string.alias.graphql",
          "string.unquoted.graphql",
          "string.unquoted.alias.graphql",
          "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js",
          "meta.field.declaration.ts variable.object.property",
          "meta.block entity.name.label",
        ],
        settings: {
          foreground: teal,
        },
      },
      {
        scope: [
          "variable.other.property",
          "support.variable.property",
          "support.variable.property.dom",
          "meta.function-call variable.other.object.property",
        ],
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: "variable.other.object.property",
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope:
          "meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.object-literal.key",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: "source.cpp meta.block variable.other",
        settings: {
          foreground: red,
        },
      },
      {
        scope: "support.other.variable",
        settings: {
          foreground: red,
        },
      },
      {
        scope: [
          "meta.class-method.js entity.name.function.js",
          "entity.name.method.js",
          "variable.function.constructor",
          "keyword.other.special-method",
          "storage.type.cs",
        ],
        settings: {
          foreground: blue,
        },
      },
      {
        scope: [
          "entity.name.function",
          "variable.other.enummember",
          "meta.function-call",
          "meta.function-call entity.name.function",
          "variable.function",
          "meta.definition.method entity.name.function",
          "meta.object-literal entity.name.function",
        ],
        settings: {
          foreground: blue,
        },
      },
      {
        scope: [
          "variable.parameter.function.language.special",
          "variable.parameter",
          "meta.function.parameters punctuation.definition.variable",
          "meta.function.parameter variable",
        ],
        settings: {
          foreground: yellow,
        },
      },
      {
        scope: [
          "keyword.other.type.php",
          "storage.type.php",
          "constant.character",
          "constant.escape",
          "keyword.other.unit",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: [
          "meta.definition.variable variable.other.constant",
          "meta.definition.variable variable.other.readwrite",
          "variable.declaration.hcl variable.other.readwrite.hcl",
          "meta.mapping.key.hcl variable.other.readwrite.hcl",
          "variable.other.declaration",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "entity.other.inherited-class",
        settings: {
          fontStyle: "",
          foreground: purple,
        },
      },
      {
        scope: [
          "support.class",
          "support.type",
          "variable.other.readwrite.alias",
          "support.orther.namespace.use.php",
          "meta.use.php",
          "support.other.namespace.php",
          "support.type.sys-types",
          "support.variable.dom",
          "support.constant.math",
          "support.type.object.module",
          "support.constant.json",
          "entity.name.namespace",
          "meta.import.qualifier",
          "variable.other.constant.object",
        ],
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: "entity.name",
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "support.function",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: [
          "source.css support.type.property-name",
          "source.sass support.type.property-name",
          "source.scss support.type.property-name",
          "source.less support.type.property-name",
          "source.stylus support.type.property-name",
          "source.postcss support.type.property-name",
          "support.type.property-name.css",
          "support.type.vendored.property-name",
          "support.type.map.key",
        ],
        settings: {
          foreground: blue,
        },
      },
      {
        scope: ["support.constant.font-name", "meta.definition.variable"],
        settings: {
          foreground: green,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.class",
          "meta.at-rule.mixin.scss entity.name.function.scss",
        ],
        settings: {
          foreground: green,
        },
      },
      {
        scope: "entity.other.attribute-name.id",
        settings: {
          foreground: pink,
        },
      },
      {
        scope: "entity.name.tag.css",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.pseudo-class punctuation.definition.entity",
          "entity.other.attribute-name.pseudo-element punctuation.definition.entity",
          "entity.other.attribute-name.class punctuation.definition.entity",
          "entity.name.tag.reference",
        ],
        settings: {
          foreground: yellow,
        },
      },
      {
        scope: "meta.property-list",
        settings: {
          foreground: lightestFg,
        },
      },
      {
        scope: [
          "meta.property-list meta.at-rule.if",
          "meta.at-rule.return variable.parameter.url",
          "meta.property-list meta.at-rule.else",
        ],
        settings: {
          foreground: orange,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.parent-selector-suffix punctuation.definition.entity.css",
        ],
        settings: {
          foreground: teal,
        },
      },
      {
        scope: "meta.property-list meta.property-list",
        settings: {
          foreground: lightestFg,
        },
      },
      {
        scope: [
          "meta.at-rule.mixin keyword.control.at-rule.mixin",
          "meta.at-rule.include entity.name.function.scss",
          "meta.at-rule.include keyword.control.at-rule.include",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: [
          "keyword.control.at-rule.include punctuation.definition.keyword",
          "keyword.control.at-rule.mixin punctuation.definition.keyword",
          "meta.at-rule.include keyword.control.at-rule.include",
          "keyword.control.at-rule.extend punctuation.definition.keyword",
          "meta.at-rule.extend keyword.control.at-rule.extend",
          "entity.other.attribute-name.placeholder.css punctuation.definition.entity.css",
          "meta.at-rule.media keyword.control.at-rule.media",
          "meta.at-rule.mixin keyword.control.at-rule.mixin",
          "meta.at-rule.function keyword.control.at-rule.function",
          "keyword.control punctuation.definition.keyword",
        ],
        settings: {
          foreground: darkPurple,
        },
      },
      {
        scope: "meta.property-list meta.at-rule.include",
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "support.constant.property-value",
        settings: {
          foreground: orange,
        },
      },
      {
        scope: [
          "entity.name.module.js",
          "variable.import.parameter.js",
          "variable.other.class.js",
        ],
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "variable.language",
        settings: {
          foreground: red,
        },
      },
      {
        scope: "variable.other punctuation.definition.variable",
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: [
          "source.js constant.other.object.key.js string.unquoted.label.js",
          "variable.language.this punctuation.definition.variable",
          "keyword.other.this",
        ],
        settings: {
          foreground: red,
        },
      },
      {
        scope: [
          "entity.other.attribute-name",
          "text.html.basic entity.other.attribute-name.html",
          "text.html.basic entity.other.attribute-name",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "text.html constant.character.entity",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.id.html",
          "meta.directive.vue entity.other.attribute-name.html",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "source.sass keyword.control",
        settings: {
          foreground: blue,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.pseudo-class",
          "entity.other.attribute-name.pseudo-element",
          "entity.other.attribute-name.placeholder",
          "meta.property-list meta.property-value",
        ],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "markup.inserted",
        settings: {
          foreground: green,
        },
      },
      {
        scope: "markup.deleted",
        settings: {
          foreground: darkRed,
        },
      },
      {
        scope: "markup.changed",
        settings: {
          foreground: blue,
        },
      },
      {
        scope: "string.regexp",
        settings: {
          foreground: lightCyan,
        },
      },
      {
        scope: "punctuation.definition.group",
        settings: {
          foreground: red,
        },
      },
      {
        scope: ["constant.other.character-class.regexp"],
        settings: {
          foreground: purple,
        },
      },
      {
        scope: [
          "constant.other.character-class.set.regexp",
          "punctuation.definition.character-class.regexp",
        ],
        settings: {
          foreground: yellow,
        },
      },
      {
        scope: "keyword.operator.quantifier.regexp",
        settings: {
          foreground: brightCyan,
        },
      },
      {
        scope: "constant.character.escape.backslash",
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "constant.character.escape",
        settings: {
          foreground: brightCyan,
        },
      },
      {
        scope: [
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
        ],
        settings: {
          foreground: blue,
        },
      },
      {
        scope: "keyword.other.unit",
        settings: {
          foreground: red,
        },
      },
      {
        scope: "text.html.markdown markup.inline.raw.markdown",
        settings: {
          foreground: purple,
        },
      },
      {
        scope:
          "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
        settings: {
          foreground: dimFg,
        },
      },
      {
        scope: [
          "heading.1.markdown entity.name",
          "heading.1.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: brightCyan,
        },
      },
      {
        scope: [
          "heading.2.markdown entity.name",
          "heading.2.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: cyan,
        },
      },
      {
        scope: [
          "heading.3.markdown entity.name",
          "heading.3.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: blue,
        },
      },
      {
        scope: [
          "heading.4.markdown entity.name",
          "heading.4.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: darkBlue,
        },
      },
      {
        scope: [
          "heading.5.markdown entity.name",
          "heading.5.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: lightFg,
        },
      },
      {
        scope: [
          "heading.6.markdown entity.name",
          "heading.6.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: neutralFg,
        },
      },
      {
        scope: ["markup.italic", "markup.italic punctuation"],
        settings: {
          fontStyle: "italic",
          foreground: lightFg,
        },
      },
      {
        scope: ["markup.bold", "markup.bold punctuation"],
        settings: {
          fontStyle: "bold",
          foreground: lightFg,
        },
      },
      {
        scope: [
          "markup.bold markup.italic",
          "markup.bold markup.italic punctuation",
        ],
        settings: {
          fontStyle: "bold italic",
          foreground: lightFg,
        },
      },
      {
        scope: ["markup.underline", "markup.underline punctuation"],
        settings: {
          fontStyle: "underline",
        },
      },
      {
        scope: "markup.quote punctuation.definition.blockquote.markdown",
        settings: {
          foreground: dimFg,
        },
      },
      {
        scope: "markup.quote",
        settings: {
          fontStyle: "italic",
        },
      },
      {
        scope: [
          "string.other.link",
          "markup.underline.link",
          "constant.other.reference.link.markdown",
          "string.other.link.description.title.markdown",
        ],
        settings: {
          foreground: teal,
        },
      },
      {
        scope: [
          "markup.fenced_code.block.markdown",
          "markup.inline.raw.string.markdown",
          "variable.language.fenced.markdown",
        ],
        settings: {
          foreground: brightCyan,
        },
      },
      {
        scope: "meta.separator",
        settings: {
          fontStyle: "bold",
          foreground: mutedFg,
        },
      },
      {
        scope: "markup.table",
        settings: {
          foreground: lightestFg,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: blue,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: cyan,
        },
      },
      {
        scope: "token.info-token",
        settings: {
          foreground: darkTeal,
        },
      },
      {
        scope: "token.warn-token",
        settings: {
          foreground: yellow,
        },
      },
      {
        scope: "token.error-token",
        settings: {
          foreground: red,
        },
      },
      {
        scope: "token.debug-token",
        settings: {
          foreground: purple,
        },
      },
      {
        scope: "entity.tag.apacheconf",
        settings: {
          foreground: red,
        },
      },
      {
        scope: ["meta.preprocessor"],
        settings: {
          foreground: teal,
        },
      },
      {
        scope: "source.env",
        settings: {
          foreground: blue,
        },
      },
      {
        scope: [
          "meta.block",
          "meta.brace",
          "punctuation.definition.block",
          "punctuation.definition.use",
          "punctuation.definition.class",
          "punctuation.definition.begin.bracket",
          "punctuation.definition.end.bracket",
          "punctuation.definition.switch-expression.begin.bracket",
          "punctuation.definition.switch-expression.end.bracket",
          "punctuation.definition.section.switch-block.begin.bracket",
          "punctuation.definition.section.switch-block.end.bracket",
          "punctuation.definition.group.shell",
          "punctuation.definition.parameters",
          "punctuation.definition.arguments",
          "punctuation.definition.dictionary",
          "punctuation.definition.array",
          "punctuation.section",
        ],
        settings: {
          foreground: lightestFg,
        },
      },
      {
        scope: ["meta.embedded.block"],
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: [
          "meta.tag JSXNested",
          "meta.jsx.children",
          "text.html",
          "text.log",
        ],
        settings: {
          foreground: lightFg,
        },
      },
      {
        scope: "punctuation.definition.list_item.markdown",
        settings: {
          foreground: lightestFg,
        },
      },
    ],
  };
  return colorSchema;
};

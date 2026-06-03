import { getColorHexMap } from "../../tokens/colorToHex";
import type { ThemeRegistration } from "shiki";

export const getTextMateColorSchema = (
  mode: "dark" | "light" = "dark",
): ThemeRegistration => {
  // Get all colors as hex from tokens
  const colors = getColorHexMap();

  const colorSchema: ThemeRegistration = {
    name: "parallax",
    displayName: "Parallax",
    type: "dark",
    colors: {
      "activityBar.background": colors.darkestBg,
      "activityBar.border": colors.darkestBg,
      "activityBar.inactiveForeground": colors.dimFg,
      "activityBarBadge.background": colors.purple,
      "activityBarBadge.foreground": colors.white,
      "activityBarTop.foreground": colors.neutralFg,
      "activityBarTop.inactiveForeground": colors.dimFg,
      "badge.background": colors.purpleBadge,
      "badge.foreground": colors.lightFg,
      "breadcrumb.activeSelectionForeground": colors.lightFg,
      "breadcrumb.background": colors.darkestBg,
      "breadcrumb.foreground": colors.neutralFg,
      "breadcrumbPicker.background": colors.darkestBg,
      "button.foreground": colors.white,
      "button.hoverBackground": colors.purpleAlphaAb,
      "button.secondaryBackground": colors.dimFg,
      "charts.blue": colors.blue,
      "charts.foreground": colors.lightFg,
      "charts.green": colors.green,
      "charts.lines": colors.darkestBg,
      "charts.purple": colors.purple,
      "charts.red": colors.red,
      "charts.yellow": colors.yellow,
      "chat.avatarBackground": colors.darkPurple,
      "chat.avatarForeground": colors.lightFg,
      "chat.requestBorder": colors.darkestBg,
      "chat.slashCommandBackground": colors.darkestBg,
      "debugConsole.errorForeground": colors.darkRed,
      "debugConsole.infoForeground": colors.neutralFg,
      "debugConsole.sourceForeground": colors.neutralFg,
      "debugConsole.warningForeground": colors.darkOrange,
      "debugConsoleInputIcon.foreground": colors.teal,
      "debugExceptionWidget.background": colors.darkestBg,
      "debugIcon.breakpointDisabledForeground": colors.dimFg,
      "debugIcon.breakpointForeground": colors.red,
      "debugIcon.breakpointUnverifiedForeground": colors.darkRed,
      "debugTokenExpression.boolean": colors.orange,
      "debugTokenExpression.error": colors.darkRed,
      "debugTokenExpression.name": colors.cyan,
      "debugTokenExpression.number": colors.orange,
      "debugTokenExpression.string": colors.green,
      "debugTokenExpression.value": colors.lightFg,
      "debugView.stateLabelBackground": colors.darkestBg,
      "debugView.valueChangedHighlight": colors.darkPurpleAlphaAb,
      descriptionForeground: colors.neutralFg,
      "diffEditor.diagonalFill": colors.neutralBg,
      "diffEditor.insertedLineBackground": colors.greenAlpha1f,
      "diffEditor.insertedTextBackground": colors.greenAlpha1f,
      "diffEditor.removedLineBackground": colors.redAlpha21,
      "diffEditor.removedTextBackground": colors.redAlpha21,
      "diffEditor.unchangedCodeBackground": colors.neutralBgAlpha66,
      "diffEditorGutter.insertedLineBackground": colors.greenAlpha26,
      "diffEditorGutter.removedLineBackground": colors.redAlpha21,
      "diffEditorOverview.insertedForeground": colors.greenAlpha26,
      "diffEditorOverview.removedForeground": colors.redAlpha21,
      disabledForeground: colors.dimFg,
      "dropdown.background": colors.darkestBg,
      "dropdown.listBackground": colors.darkestBg,
      "editor.findMatchBackground": colors.purpleAlpha66,
      "editor.findMatchBorder": colors.yellow,
      "editor.findMatchHighlightBackground": colors.purpleAlpha66,
      "editor.findRangeHighlightBackground": colors.blueAlpha33,
      "editor.focusedStackFrameHighlightBackground": colors.tealAlpha1f,
      "editor.foldBackground": colors.darkestBgAlpha4a,
      "editor.foreground": colors.lightFg,
      "editor.inactiveSelectionBackground": colors.blueAlpha26,
      "editor.lineHighlightBackground": colors.neutralBg,
      "editor.rangeHighlightBackground": colors.blueAlpha1f,
      "editor.selectionBackground": colors.blueAlpha4c,
      "editor.selectionHighlightBackground": colors.blueAlpha45,
      "editor.stackFrameHighlightBackground": colors.yellowAlpha1f,
      "editor.wordHighlightBackground": colors.blueAlpha45,
      "editor.wordHighlightStrongBackground": colors.blueAlpha54,
      "editorBracketHighlight.foreground1": colors.blue,
      "editorBracketHighlight.foreground2": colors.cyan,
      "editorBracketHighlight.foreground3": colors.purple,
      "editorBracketHighlight.foreground4": colors.teal,
      "editorBracketHighlight.foreground5": colors.green,
      "editorBracketHighlight.foreground6": colors.orange,
      "editorBracketHighlight.unexpectedBracket.foreground": colors.red,
      "editorBracketMatch.background": colors.darkestBg,
      "editorBracketPairGuide.activeBackground1": colors.blue,
      "editorBracketPairGuide.activeBackground2": colors.cyan,
      "editorBracketPairGuide.activeBackground3": colors.purple,
      "editorBracketPairGuide.activeBackground4": colors.teal,
      "editorBracketPairGuide.activeBackground5": colors.green,
      "editorBracketPairGuide.activeBackground6": colors.orange,
      "editorCodeLens.foreground": colors.mutedFg,
      "editorCursor.foreground": colors.lightestFg,
      "editorError.foreground": colors.red,
      "editorGhostText.foreground": colors.dimFg,
      "editorGroup.border": colors.darkestBg,
      "editorGroupHeader.border": colors.darkestBg,
      "editorGroupHeader.noTabsBackground": colors.darkestBg,
      "editorGroupHeader.tabsBackground": colors.darkestBg,
      "editorGroupHeader.tabsBorder": colors.darkestBg,
      "editorGutter.deletedBackground": colors.darkRed,
      "editorGutter.modifiedBackground": colors.darkBlue,
      "editorHint.foreground": colors.darkTeal,
      "editorHoverWidget.background": colors.darkestBg,
      "editorHoverWidget.border": colors.darkestBg,
      "editorIndentGuide.background1": colors.darkFg,
      "editorInfo.foreground": colors.darkTeal,
      "editorInlayHint.foreground": colors.dimFg,
      "editorLightBulb.foreground": colors.yellow,
      "editorLightBulbAutoFix.foreground": colors.yellow,
      "editorLineNumber.activeForeground": colors.neutralFg,
      "editorLineNumber.foreground": colors.darkFg,
      "editorLink.activeForeground": colors.teal,
      "editorMarkerNavigation.background": colors.darkestBg,
      "editorOverviewRuler.border": colors.darkestBg,
      "editorOverviewRuler.bracketMatchForeground": colors.darkestBg,
      "editorOverviewRuler.errorForeground": colors.red,
      "editorOverviewRuler.findMatchForeground": colors.lightFgAlpha45,
      "editorOverviewRuler.infoForeground": colors.cyan,
      "editorOverviewRuler.modifiedForeground": colors.darkBlue,
      "editorOverviewRuler.rangeHighlightForeground": colors.lightFgAlpha45,
      "editorOverviewRuler.selectionHighlightForeground": colors.lightFgAlpha21,
      "editorOverviewRuler.warningForeground": colors.orange,
      "editorOverviewRuler.wordHighlightForeground": colors.purpleAlpha54,
      "editorOverviewRuler.wordHighlightStrongForeground": colors.purpleAlpha66,
      "editorPane.background": colors.darkBg,
      "editorRuler.foreground": colors.darkestBg,
      "editorSuggestWidget.background": colors.darkestBg,
      "editorSuggestWidget.border": colors.darkestBg,
      "editorSuggestWidget.selectedBackground": colors.neutralBg,
      "editorWarning.foreground": colors.orange,
      "editorWhitespace.foreground": colors.darkFg,
      "editorWidget.background": colors.darkestBg,
      "editorWidget.border": colors.darkestBg,
      "editorWidget.resizeBorder": colors.blueAlpha33,
      errorForeground: colors.darkRed,
      "extensionBadge.remoteBackground": colors.darkPurple,
      "extensionBadge.remoteForeground": colors.white,
      "extensionButton.prominentBackground": colors.darkPurpleAlphaDe,
      "extensionButton.prominentForeground": colors.white,
      "extensionButton.prominentHoverBackground": colors.purpleAlphaAb,
      focusBorder: colors.blueAlpha33,
      foreground: colors.neutralFg,
      "gitDecoration.addedResourceForeground": colors.green,
      "gitDecoration.conflictingResourceForeground": colors.orangeAlphaCc,
      "gitDecoration.deletedResourceForeground": colors.darkRed,
      "gitDecoration.ignoredResourceForeground": colors.mutedFg,
      "gitDecoration.modifiedResourceForeground": colors.blue,
      "gitDecoration.renamedResourceForeground": colors.cyan,
      "gitDecoration.stageDeletedResourceForeground": colors.darkRed,
      "gitDecoration.stageModifiedResourceForeground": colors.blue,
      "gitDecoration.untrackedResourceForeground": colors.green,
      "gitlens.gutterBackgroundColor": colors.darkestBg,
      "gitlens.gutterUncommittedForegroundColor": colors.blue,
      "gitlens.trailingLineForegroundColor": colors.dimFg,
      "icon.foreground": colors.neutralFg,
      "inlineChat.foreground": colors.lightFg,
      "inlineChatDiff.inserted": colors.greenAlpha40,
      "inlineChatDiff.removed": colors.redAlpha40,
      "inlineChatInput.background": colors.darkestBg,
      "input.background": colors.darkestBg,
      "input.border": colors.darkestBg,
      "input.placeholderForeground": colors.neutralFgAlpha8a,
      "inputOption.activeBackground": colors.purpleAlpha45,
      "inputOption.activeForeground": colors.lightestFg,
      "inputValidation.errorBackground": colors.redBg,
      "inputValidation.errorBorder": colors.darkRed,
      "inputValidation.errorForeground": colors.lightFg,
      "inputValidation.infoBackground": colors.darkBlueAlpha5c,
      "inputValidation.infoBorder": colors.darkBlue,
      "inputValidation.infoForeground": colors.lightFg,
      "inputValidation.warningBackground": colors.orangeBg,
      "inputValidation.warningBorder": colors.darkOrange,
      "inputValidation.warningForeground": colors.white,
      "list.activeSelectionBackground": colors.neutralBg,
      "list.activeSelectionForeground": colors.lightFg,
      "list.deemphasizedForeground": colors.neutralFg,
      "list.dropBackground": colors.neutralBg,
      "list.errorForeground": colors.darkRed,
      "list.focusBackground": colors.neutralBg,
      "list.focusForeground": colors.lightFg,
      "list.highlightForeground": colors.blue,
      "list.hoverBackground": colors.darkestBg,
      "list.inactiveSelectionBackground": colors.neutralBg,
      "list.inactiveSelectionForeground": colors.lightFg,
      "list.invalidItemForeground": colors.darkOrange,
      "list.warningForeground": colors.darkOrange,
      "listFilterWidget.background": colors.darkestBg,
      "listFilterWidget.outline": colors.darkPurple,
      "menu.background": colors.darkestBg,
      "menu.border": colors.darkestBg,
      "menu.selectionBackground": colors.neutralBg,
      "menu.selectionForeground": colors.lightFg,
      "menu.separatorBackground": colors.darkestBg,
      "menubar.selectionBorder": colors.neutralBg,
      "menubar.selectionForeground": colors.lightFg,
      "merge.currentContentBackground": colors.darkTealAlpha45,
      "merge.currentHeaderBackground": colors.cyanAlpha26,
      "merge.incomingContentBackground": colors.darkPurpleAlpha45,
      "merge.incomingHeaderBackground": colors.darkPurpleAlphaAb,
      "mergeEditor.change.background": colors.cyanAlpha26,
      "mergeEditor.change.word.background": colors.cyanAlpha40,
      "mergeEditor.conflict.handled.minimapOverViewRuler": colors.green,
      "mergeEditor.conflict.handledFocused.border": colors.greenAlpha66,
      "mergeEditor.conflict.handledUnfocused.border": colors.greenAlpha26,
      "mergeEditor.conflict.unhandled.minimapOverViewRuler": colors.orange,
      "mergeEditor.conflict.unhandledFocused.border": colors.orangeAlphaB0,
      "mergeEditor.conflict.unhandledUnfocused.border": colors.orangeAlpha87,
      "minimapGutter.addedBackground": colors.darkGreen,
      "minimapGutter.deletedBackground": colors.darkRed,
      "minimapGutter.modifiedBackground": colors.darkBlue,
      "multiDiffEditor.border": colors.darkBg,
      "multiDiffEditor.headerBackground": colors.darkBg,
      "notebook.cellBorderColor": colors.darkestBg,
      "notebook.cellEditorBackground": colors.darkestBg,
      "notebook.editorBackground": colors.darkBg,
      "notebook.focusedCellBorder": colors.darkBlue,
      "notificationCenterHeader.background": colors.darkestBg,
      "notifications.background": colors.darkestBg,
      "notificationsInfoIcon.foreground": colors.darkTeal,
      "notificationsWarningIcon.foreground": colors.darkOrange,
      "panel.background": colors.darkestBg,
      "panel.border": colors.darkestBg,
      "panelInput.border": colors.darkestBg,
      "panelTitle.activeBorder": colors.darkestBg,
      "panelTitle.inactiveForeground": colors.mutedFg,
      "peekView.border": colors.darkestBg,
      "peekViewEditor.background": colors.darkestBg,
      "peekViewResult.background": colors.darkestBg,
      "peekViewResult.lineForeground": colors.lightFg,
      "peekViewResult.matchHighlightBackground": colors.purpleAlpha66,
      "peekViewResult.selectionBackground": colors.purpleAlpha33,
      "peekViewResult.selectionForeground": colors.lightFg,
      "peekViewTitle.background": colors.darkestBg,
      "peekViewTitleLabel.foreground": colors.lightFg,
      "pickerGroup.border": colors.darkestBg,
      "progressBar.background": colors.darkPurple,
      "sash.hoverBorder": colors.darkBlue,
      "scmGraph.foreground1": colors.orange,
      "scmGraph.foreground2": colors.yellow,
      "scmGraph.foreground3": colors.green,
      "scmGraph.foreground4": colors.blue,
      "scmGraph.foreground5": colors.purple,
      "scmGraph.historyItemBaseRefColor": colors.darkPurple,
      "scmGraph.historyItemHoverAdditionsForeground": colors.green,
      "scmGraph.historyItemHoverDefaultLabelForeground": colors.lightFg,
      "scmGraph.historyItemHoverDeletionsForeground": colors.red,
      "scmGraph.historyItemHoverLabelForeground": colors.darkBg,
      "scmGraph.historyItemRefColor": colors.darkBlue,
      "scmGraph.historyItemRemoteRefColor": colors.green,
      "scrollbar.shadow": colors.shadowBlack,
      "scrollbarSlider.activeBackground": colors.lightFgAlpha21,
      "scrollbarSlider.background": colors.lightFgAlpha14,
      "scrollbarSlider.hoverBackground": colors.lightFgAlpha1a,
      "selection.background": colors.blueAlpha40,
      "settings.headerForeground": colors.blue,
      "sideBar.background": colors.darkestBg,
      "sideBar.border": colors.darkestBg,
      "sideBar.foreground": colors.neutralFg,
      "sideBarSectionHeader.background": colors.darkestBg,
      "sideBarSectionHeader.border": colors.darkestBg,
      "sideBarTitle.foreground": colors.neutralFg,
      "statusBar.background": colors.darkestBg,
      "statusBar.border": colors.darkestBg,
      "statusBar.debuggingBackground": colors.darkestBg,
      "statusBar.foreground": colors.neutralFg,
      "statusBar.noFolderBackground": colors.darkestBg,
      "statusBarItem.activeBackground": colors.darkestBg,
      "statusBarItem.prominentBackground": colors.darkestBg,
      "tab.activeBackground": colors.darkBg,
      "tab.activeBorder": colors.purple,
      "tab.activeForeground": colors.lightFg,
      "tab.activeModifiedBorder": colors.darkBg,
      "tab.border": colors.darkestBg,
      "tab.inactiveBackground": colors.darkestBg,
      "tab.inactiveModifiedBorder": colors.neutralBg,
      "tab.lastPinnedBorder": colors.neutralBg,
      "tab.unfocusedActiveBorder": colors.neutralBg,
      "tab.unfocusedActiveForeground": colors.lightFg,
      "tab.unfocusedHoverForeground": colors.lightFg,
      "tab.unfocusedInactiveForeground": colors.neutralFg,
      "terminal.ansiBlack": colors.darkFg,
      "terminal.ansiBlue": colors.blue,
      "terminal.ansiBrightBlack": colors.dimFg,
      "terminal.ansiBrightBlue": colors.blue,
      "terminal.ansiBrightCyan": colors.lightCyan,
      "terminal.ansiBrightGreen": colors.green,
      "terminal.ansiBrightMagenta": colors.purple,
      "terminal.ansiBrightRed": colors.red,
      "terminal.ansiBrightWhite": colors.lightestFg,
      "terminal.ansiBrightYellow": colors.yellow,
      "terminal.ansiCyan": colors.cyan,
      "terminal.ansiGreen": colors.darkGreen,
      "terminal.ansiMagenta": colors.darkPurple,
      "terminal.ansiRed": colors.darkRed,
      "terminal.ansiWhite": colors.lightFg,
      "terminal.ansiYellow": colors.orange,
      "terminal.background": colors.darkestBg,
      "terminal.selectionBackground": colors.blueAlpha4c,
      "textBlockQuote.background": colors.darkestBg,
      "textCodeBlock.background": colors.darkestBg,
      "textLink.foreground": colors.blue,
      "textPreformat.foreground": colors.neutralFg,
      "textSeparator.foreground": colors.darkFg,
      "titleBar.activeBackground": colors.darkestBg,
      "titleBar.border": colors.darkestBg,
      "titleBar.inactiveBackground": colors.darkestBg,
      "toolbar.activeBackground": colors.neutralBg,
      "toolbar.hoverBackground": colors.neutralBg,
      "tree.indentGuidesStroke": colors.darkFg,
      "walkThrough.embeddedEditorBackground": colors.darkestBg,
      "window.activeBorder": colors.darkestBg,
      "window.inactiveBorder": colors.darkestBg,
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
          foreground: colors.mutedFg,
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
          foreground: colors.dimFg,
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
          foreground: colors.neutralFg,
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
          foreground: colors.orange,
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
          foreground: colors.green,
        },
      },
      {
        scope: [
          "constant.other.color",
          "constant.other.color.rgb-value.hex punctuation.definition.constant",
        ],
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: ["invalid", "invalid.illegal"],
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: "invalid.deprecated",
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: "storage.type",
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: ["meta.var.expr storage.type", "storage.modifier"],
        settings: {
          foreground: colors.darkPurple,
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
          foreground: colors.cyan,
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
          foreground: colors.darkTeal,
        },
      },
      {
        scope: ["keyword.operator.spread", "keyword.operator.rest"],
        settings: {
          fontStyle: "bold",
          foreground: colors.red,
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
          foreground: colors.brightCyan,
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
          foreground: colors.cyan,
        },
      },
      {
        scope: ["keyword", "keyword.control", "keyword.other.important"],
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: "keyword.other.DML",
        settings: {
          foreground: colors.cyan,
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
          foreground: colors.purple,
        },
      },
      {
        scope: "entity.name.tag",
        settings: {
          foreground: colors.red,
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
          foreground: colors.pink,
        },
      },
      {
        scope: [
          "punctuation.definition.tag",
          "text.html.php meta.embedded.block.html meta.tag.metadata.script.end.html punctuation.definition.tag.begin.html text.html.basic",
        ],
        settings: {
          foreground: colors.darkPink,
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
          foreground: colors.yellow,
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
          foreground: colors.lightFg,
        },
      },
      {
        scope: "meta.array.literal variable",
        settings: {
          foreground: colors.cyan,
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
          foreground: colors.teal,
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
          foreground: colors.cyan,
        },
      },
      {
        scope: "variable.other.object.property",
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope:
          "meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.object-literal.key",
        settings: {
          foreground: colors.darkTeal,
        },
      },
      {
        scope: "source.cpp meta.block variable.other",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: "support.other.variable",
        settings: {
          foreground: colors.red,
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
          foreground: colors.blue,
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
          foreground: colors.blue,
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
          foreground: colors.yellow,
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
          foreground: colors.purple,
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
          foreground: colors.purple,
        },
      },
      {
        scope: "entity.other.inherited-class",
        settings: {
          fontStyle: "",
          foreground: colors.purple,
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
          foreground: colors.darkTeal,
        },
      },
      {
        scope: "entity.name",
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: "support.function",
        settings: {
          foreground: colors.darkTeal,
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
          foreground: colors.blue,
        },
      },
      {
        scope: ["support.constant.font-name", "meta.definition.variable"],
        settings: {
          foreground: colors.green,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.class",
          "meta.at-rule.mixin.scss entity.name.function.scss",
        ],
        settings: {
          foreground: colors.green,
        },
      },
      {
        scope: "entity.other.attribute-name.id",
        settings: {
          foreground: colors.pink,
        },
      },
      {
        scope: "entity.name.tag.css",
        settings: {
          foreground: colors.darkTeal,
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
          foreground: colors.yellow,
        },
      },
      {
        scope: "meta.property-list",
        settings: {
          foreground: colors.lightestFg,
        },
      },
      {
        scope: [
          "meta.property-list meta.at-rule.if",
          "meta.at-rule.return variable.parameter.url",
          "meta.property-list meta.at-rule.else",
        ],
        settings: {
          foreground: colors.orange,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.parent-selector-suffix punctuation.definition.entity.css",
        ],
        settings: {
          foreground: colors.teal,
        },
      },
      {
        scope: "meta.property-list meta.property-list",
        settings: {
          foreground: colors.lightestFg,
        },
      },
      {
        scope: [
          "meta.at-rule.mixin keyword.control.at-rule.mixin",
          "meta.at-rule.include entity.name.function.scss",
          "meta.at-rule.include keyword.control.at-rule.include",
        ],
        settings: {
          foreground: colors.purple,
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
          foreground: colors.darkPurple,
        },
      },
      {
        scope: "meta.property-list meta.at-rule.include",
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: "support.constant.property-value",
        settings: {
          foreground: colors.orange,
        },
      },
      {
        scope: [
          "entity.name.module.js",
          "variable.import.parameter.js",
          "variable.other.class.js",
        ],
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: "variable.language",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: "variable.other punctuation.definition.variable",
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: [
          "source.js constant.other.object.key.js string.unquoted.label.js",
          "variable.language.this punctuation.definition.variable",
          "keyword.other.this",
        ],
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: [
          "entity.other.attribute-name",
          "text.html.basic entity.other.attribute-name.html",
          "text.html.basic entity.other.attribute-name",
        ],
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: "text.html constant.character.entity",
        settings: {
          foreground: colors.darkTeal,
        },
      },
      {
        scope: [
          "entity.other.attribute-name.id.html",
          "meta.directive.vue entity.other.attribute-name.html",
        ],
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: "source.sass keyword.control",
        settings: {
          foreground: colors.blue,
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
          foreground: colors.purple,
        },
      },
      {
        scope: "markup.inserted",
        settings: {
          foreground: colors.green,
        },
      },
      {
        scope: "markup.deleted",
        settings: {
          foreground: colors.darkRed,
        },
      },
      {
        scope: "markup.changed",
        settings: {
          foreground: colors.blue,
        },
      },
      {
        scope: "string.regexp",
        settings: {
          foreground: colors.lightCyan,
        },
      },
      {
        scope: "punctuation.definition.group",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: ["constant.other.character-class.regexp"],
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: [
          "constant.other.character-class.set.regexp",
          "punctuation.definition.character-class.regexp",
        ],
        settings: {
          foreground: colors.yellow,
        },
      },
      {
        scope: "keyword.operator.quantifier.regexp",
        settings: {
          foreground: colors.brightCyan,
        },
      },
      {
        scope: "constant.character.escape.backslash",
        settings: {
          foreground: colors.lightFg,
        },
      },
      {
        scope: "constant.character.escape",
        settings: {
          foreground: colors.brightCyan,
        },
      },
      {
        scope: [
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
        ],
        settings: {
          foreground: colors.blue,
        },
      },
      {
        scope: "keyword.other.unit",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: "text.html.markdown markup.inline.raw.markdown",
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope:
          "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
        settings: {
          foreground: colors.dimFg,
        },
      },
      {
        scope: [
          "heading.1.markdown entity.name",
          "heading.1.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.brightCyan,
        },
      },
      {
        scope: [
          "heading.2.markdown entity.name",
          "heading.2.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.cyan,
        },
      },
      {
        scope: [
          "heading.3.markdown entity.name",
          "heading.3.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.blue,
        },
      },
      {
        scope: [
          "heading.4.markdown entity.name",
          "heading.4.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.darkBlue,
        },
      },
      {
        scope: [
          "heading.5.markdown entity.name",
          "heading.5.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.lightFg,
        },
      },
      {
        scope: [
          "heading.6.markdown entity.name",
          "heading.6.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: colors.neutralFg,
        },
      },
      {
        scope: ["markup.italic", "markup.italic punctuation"],
        settings: {
          fontStyle: "italic",
          foreground: colors.lightFg,
        },
      },
      {
        scope: ["markup.bold", "markup.bold punctuation"],
        settings: {
          fontStyle: "bold",
          foreground: colors.lightFg,
        },
      },
      {
        scope: [
          "markup.bold markup.italic",
          "markup.bold markup.italic punctuation",
        ],
        settings: {
          fontStyle: "bold italic",
          foreground: colors.lightFg,
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
          foreground: colors.dimFg,
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
          foreground: colors.teal,
        },
      },
      {
        scope: [
          "markup.fenced_code.block.markdown",
          "markup.inline.raw.string.markdown",
          "variable.language.fenced.markdown",
        ],
        settings: {
          foreground: colors.brightCyan,
        },
      },
      {
        scope: "meta.separator",
        settings: {
          fontStyle: "bold",
          foreground: colors.mutedFg,
        },
      },
      {
        scope: "markup.table",
        settings: {
          foreground: colors.lightestFg,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: colors.blue,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: colors.darkTeal,
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: colors.cyan,
        },
      },
      {
        scope: "token.info-token",
        settings: {
          foreground: colors.darkTeal,
        },
      },
      {
        scope: "token.warn-token",
        settings: {
          foreground: colors.yellow,
        },
      },
      {
        scope: "token.error-token",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: "token.debug-token",
        settings: {
          foreground: colors.purple,
        },
      },
      {
        scope: "entity.tag.apacheconf",
        settings: {
          foreground: colors.red,
        },
      },
      {
        scope: ["meta.preprocessor"],
        settings: {
          foreground: colors.teal,
        },
      },
      {
        scope: "source.env",
        settings: {
          foreground: colors.blue,
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
          foreground: colors.lightestFg,
        },
      },
      {
        scope: ["meta.embedded.block"],
        settings: {
          foreground: colors.lightFg,
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
          foreground: colors.lightFg,
        },
      },
      {
        scope: "punctuation.definition.list_item.markdown",
        settings: {
          foreground: colors.lightestFg,
        },
      },
    ],
  };
  return colorSchema;
};

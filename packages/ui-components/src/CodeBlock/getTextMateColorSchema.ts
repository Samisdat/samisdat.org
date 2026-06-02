import type { ThemeRegistration } from "shiki";

export const getTextMateColorSchema = (
  mode: "dark" | "light" = "dark",
): ThemeRegistration => {
  const color1 = "#0f051d";

  const colorSchema: ThemeRegistration = {
    name: "parallax",
    displayName: "Parallax",
    type: "dark",
    colors: {
      "activityBar.background": color1,
      "activityBar.border": color1,
      "activityBar.inactiveForeground": "#574c6a",
      "activityBarBadge.background": "#a050e6",
      "activityBarBadge.foreground": "#ffffff",
      "activityBarTop.foreground": "#a7a1b5",
      "activityBarTop.inactiveForeground": "#574c6a",
      "badge.background": "#31184899",
      "badge.foreground": "#ebdedb",
      "breadcrumb.activeSelectionForeground": "#ebdedb",
      "breadcrumb.background": color1,
      "breadcrumb.foreground": "#a7a1b5",
      "breadcrumbPicker.background": color1,
      "button.foreground": "#ffffff",
      "button.hoverBackground": "#a050e6ab",
      "button.secondaryBackground": "#574c6a",
      "charts.blue": "#4c7df7",
      "charts.foreground": "#ebdedb",
      "charts.green": "#00b667",
      "charts.lines": color1,
      "charts.purple": "#a050e6",
      "charts.red": "#f2396d",
      "charts.yellow": "#f7be2b",
      "chat.avatarBackground": "#7025aa",
      "chat.avatarForeground": "#ebdedb",
      "chat.requestBorder": color1,
      "chat.slashCommandBackground": color1,
      "debugConsole.errorForeground": "#b70045",
      "debugConsole.infoForeground": "#a7a1b5",
      "debugConsole.sourceForeground": "#a7a1b5",
      "debugConsole.warningForeground": "#af5600",
      "debugConsoleInputIcon.foreground": "#60ddc0",
      "debugExceptionWidget.background": color1,
      "debugIcon.breakpointDisabledForeground": "#574c6a",
      "debugIcon.breakpointForeground": "#f2396d",
      "debugIcon.breakpointUnverifiedForeground": "#b70045",
      "debugTokenExpression.boolean": "#ef8c24",
      "debugTokenExpression.error": "#b70045",
      "debugTokenExpression.name": "#51cec7",
      "debugTokenExpression.number": "#ef8c24",
      "debugTokenExpression.string": "#00b667",
      "debugTokenExpression.value": "#ebdedb",
      "debugView.stateLabelBackground": color1,
      "debugView.valueChangedHighlight": "#7025aaab",
      descriptionForeground: "#a7a1b5",
      "diffEditor.diagonalFill": "#332647",
      "diffEditor.insertedLineBackground": "#00b6671f",
      "diffEditor.insertedTextBackground": "#00b6671f",
      "diffEditor.removedLineBackground": "#f2396d21",
      "diffEditor.removedTextBackground": "#f2396d21",
      "diffEditor.unchangedCodeBackground": "#33264766",
      "diffEditorGutter.insertedLineBackground": "#00b66726",
      "diffEditorGutter.removedLineBackground": "#f2396d21",
      "diffEditorOverview.insertedForeground": "#00b66726",
      "diffEditorOverview.removedForeground": "#f2396d21",
      disabledForeground: "#574c6a",
      "dropdown.background": color1,
      "dropdown.listBackground": color1,
      "editor.findMatchBackground": "#a050e666",
      "editor.findMatchBorder": "#f7be2b",
      "editor.findMatchHighlightBackground": "#a050e666",
      "editor.findRangeHighlightBackground": "#4c7df733",
      "editor.focusedStackFrameHighlightBackground": "#60ddc01f",
      "editor.foldBackground": "#0f051d4a",
      "editor.foreground": "#ebdedb",
      "editor.inactiveSelectionBackground": "#4c7df726",
      "editor.lineHighlightBackground": "#332647",
      "editor.rangeHighlightBackground": "#4c7df71f",
      "editor.selectionBackground": "#4c7df74c",
      "editor.selectionHighlightBackground": "#4c7df745",
      "editor.stackFrameHighlightBackground": "#f7be2b1f",
      "editor.wordHighlightBackground": "#4c7df745",
      "editor.wordHighlightStrongBackground": "#4c7df754",
      "editorBracketHighlight.foreground1": "#4c7df7",
      "editorBracketHighlight.foreground2": "#51cec7",
      "editorBracketHighlight.foreground3": "#a050e6",
      "editorBracketHighlight.foreground4": "#60ddc0",
      "editorBracketHighlight.foreground5": "#00b667",
      "editorBracketHighlight.foreground6": "#ef8c24",
      "editorBracketHighlight.unexpectedBracket.foreground": "#f2396d",
      "editorBracketMatch.background": color1,
      "editorBracketPairGuide.activeBackground1": "#4c7df7",
      "editorBracketPairGuide.activeBackground2": "#51cec7",
      "editorBracketPairGuide.activeBackground3": "#a050e6",
      "editorBracketPairGuide.activeBackground4": "#60ddc0",
      "editorBracketPairGuide.activeBackground5": "#00b667",
      "editorBracketPairGuide.activeBackground6": "#ef8c24",
      "editorCodeLens.foreground": "#7b728c",
      "editorCursor.foreground": "#faefed",
      "editorError.foreground": "#f2396d",
      "editorGhostText.foreground": "#574c6a",
      "editorGroup.border": color1,
      "editorGroupHeader.border": color1,
      "editorGroupHeader.noTabsBackground": color1,
      "editorGroupHeader.tabsBackground": color1,
      "editorGroupHeader.tabsBorder": color1,
      "editorGutter.deletedBackground": "#b70045",
      "editorGutter.modifiedBackground": "#2247af",
      "editorHint.foreground": "#00928c",
      "editorHoverWidget.background": color1,
      "editorHoverWidget.border": color1,
      "editorIndentGuide.background1": "#45385b",
      "editorInfo.foreground": "#00928c",
      "editorInlayHint.foreground": "#574c6a",
      "editorLightBulb.foreground": "#f7be2b",
      "editorLightBulbAutoFix.foreground": "#f7be2b",
      "editorLineNumber.activeForeground": "#a7a1b5",
      "editorLineNumber.foreground": "#45385b",
      "editorLink.activeForeground": "#60ddc0",
      "editorMarkerNavigation.background": color1,
      "editorOverviewRuler.border": color1,
      "editorOverviewRuler.bracketMatchForeground": color1,
      "editorOverviewRuler.errorForeground": "#f2396d",
      "editorOverviewRuler.findMatchForeground": "#ebdedb45",
      "editorOverviewRuler.infoForeground": "#51cec7",
      "editorOverviewRuler.modifiedForeground": "#2247af",
      "editorOverviewRuler.rangeHighlightForeground": "#ebdedb45",
      "editorOverviewRuler.selectionHighlightForeground": "#ebdedb21",
      "editorOverviewRuler.warningForeground": "#ef8c24",
      "editorOverviewRuler.wordHighlightForeground": "#a050e654",
      "editorOverviewRuler.wordHighlightStrongForeground": "#a050e666",
      "editorPane.background": "#1e142e",
      "editorRuler.foreground": color1,
      "editorSuggestWidget.background": color1,
      "editorSuggestWidget.border": color1,
      "editorSuggestWidget.selectedBackground": "#332647",
      "editorWarning.foreground": "#ef8c24",
      "editorWhitespace.foreground": "#45385b",
      "editorWidget.background": color1,
      "editorWidget.border": color1,
      "editorWidget.resizeBorder": "#4c7df733",
      errorForeground: "#b70045",
      "extensionBadge.remoteBackground": "#7025aa",
      "extensionBadge.remoteForeground": "#ffffff",
      "extensionButton.prominentBackground": "#7025aade",
      "extensionButton.prominentForeground": "#ffffff",
      "extensionButton.prominentHoverBackground": "#a050e6ab",
      focusBorder: "#4c7df733",
      foreground: "#a7a1b5",
      "gitDecoration.addedResourceForeground": "#00b667",
      "gitDecoration.conflictingResourceForeground": "#ef8c24cc",
      "gitDecoration.deletedResourceForeground": "#b70045",
      "gitDecoration.ignoredResourceForeground": "#7b728c",
      "gitDecoration.modifiedResourceForeground": "#4c7df7",
      "gitDecoration.renamedResourceForeground": "#51cec7",
      "gitDecoration.stageDeletedResourceForeground": "#b70045",
      "gitDecoration.stageModifiedResourceForeground": "#4c7df7",
      "gitDecoration.untrackedResourceForeground": "#00b667",
      "gitlens.gutterBackgroundColor": "#0f051d",
      "gitlens.gutterUncommittedForegroundColor": "#4c7df7",
      "gitlens.trailingLineForegroundColor": "#574c6a",
      "icon.foreground": "#a7a1b5",
      "inlineChat.foreground": "#ebdedb",
      "inlineChatDiff.inserted": "#00b66740",
      "inlineChatDiff.removed": "#f2396d40",
      "inlineChatInput.background": color1,
      "input.background": color1,
      "input.border": color1,
      "input.placeholderForeground": "#a7a1b58a",
      "inputOption.activeBackground": "#a050e645",
      "inputOption.activeForeground": "#faefed",
      "inputValidation.errorBackground": "#4d1221",
      "inputValidation.errorBorder": "#b70045",
      "inputValidation.errorForeground": "#ebdedb",
      "inputValidation.infoBackground": "#2247af5c",
      "inputValidation.infoBorder": "#2247af",
      "inputValidation.infoForeground": "#ebdedb",
      "inputValidation.warningBackground": "#4d2c0e",
      "inputValidation.warningBorder": "#af5600",
      "inputValidation.warningForeground": "#ffffff",
      "list.activeSelectionBackground": "#332647",
      "list.activeSelectionForeground": "#ebdedb",
      "list.deemphasizedForeground": "#a7a1b5",
      "list.dropBackground": "#332647",
      "list.errorForeground": "#b70045",
      "list.focusBackground": "#332647",
      "list.focusForeground": "#ebdedb",
      "list.highlightForeground": "#4c7df7",
      "list.hoverBackground": color1,
      "list.inactiveSelectionBackground": "#332647",
      "list.inactiveSelectionForeground": "#ebdedb",
      "list.invalidItemForeground": "#af5600",
      "list.warningForeground": "#af5600",
      "listFilterWidget.background": color1,
      "listFilterWidget.outline": "#7025aa",
      "menu.background": color1,
      "menu.border": color1,
      "menu.selectionBackground": "#332647",
      "menu.selectionForeground": "#ebdedb",
      "menu.separatorBackground": color1,
      "menubar.selectionBorder": "#332647",
      "menubar.selectionForeground": "#ebdedb",
      "merge.currentContentBackground": "#00928c45",
      "merge.currentHeaderBackground": "#51cec726",
      "merge.incomingContentBackground": "#7025aa45",
      "merge.incomingHeaderBackground": "#7025aaab",
      "mergeEditor.change.background": "#51cec726",
      "mergeEditor.change.word.background": "#51cec740",
      "mergeEditor.conflict.handled.minimapOverViewRuler": "#00b667",
      "mergeEditor.conflict.handledFocused.border": "#00b66766",
      "mergeEditor.conflict.handledUnfocused.border": "#00b66726",
      "mergeEditor.conflict.unhandled.minimapOverViewRuler": "#ef8c24",
      "mergeEditor.conflict.unhandledFocused.border": "#ef8c24b0",
      "mergeEditor.conflict.unhandledUnfocused.border": "#ef8c2487",
      "minimapGutter.addedBackground": "#007d33",
      "minimapGutter.deletedBackground": "#b70045",
      "minimapGutter.modifiedBackground": "#2247af",
      "multiDiffEditor.border": "#1e142e",
      "multiDiffEditor.headerBackground": "#1e142e",
      "notebook.cellBorderColor": color1,
      "notebook.cellEditorBackground": color1,
      "notebook.editorBackground": "#1e142e",
      "notebook.focusedCellBorder": "#2247af",
      "notificationCenterHeader.background": color1,
      "notifications.background": color1,
      "notificationsInfoIcon.foreground": "#00928c",
      "notificationsWarningIcon.foreground": "#af5600",
      "panel.background": color1,
      "panel.border": color1,
      "panelInput.border": color1,
      "panelTitle.activeBorder": color1,
      "panelTitle.inactiveForeground": "#7b728c",
      "peekView.border": color1,
      "peekViewEditor.background": color1,
      "peekViewResult.background": color1,
      "peekViewResult.lineForeground": "#ebdedb",
      "peekViewResult.matchHighlightBackground": "#a050e666",
      "peekViewResult.selectionBackground": "#a050e633",
      "peekViewResult.selectionForeground": "#ebdedb",
      "peekViewTitle.background": color1,
      "peekViewTitleLabel.foreground": "#ebdedb",
      "pickerGroup.border": color1,
      "progressBar.background": "#7025aa",
      "sash.hoverBorder": "#2247af",
      "scmGraph.foreground1": "#ef8c24",
      "scmGraph.foreground2": "#f7be2b",
      "scmGraph.foreground3": "#00b667",
      "scmGraph.foreground4": "#4c7df7",
      "scmGraph.foreground5": "#a050e6",
      "scmGraph.historyItemBaseRefColor": "#7025aa",
      "scmGraph.historyItemHoverAdditionsForeground": "#00b667",
      "scmGraph.historyItemHoverDefaultLabelForeground": "#ebdedb",
      "scmGraph.historyItemHoverDeletionsForeground": "#f2396d",
      "scmGraph.historyItemHoverLabelForeground": "#1e142e",
      "scmGraph.historyItemRefColor": "#2247af",
      "scmGraph.historyItemRemoteRefColor": "#00b667",
      "scrollbar.shadow": "#00000033",
      "scrollbarSlider.activeBackground": "#ebdedb21",
      "scrollbarSlider.background": "#ebdedb14",
      "scrollbarSlider.hoverBackground": "#ebdedb1a",
      "selection.background": "#4c7df740",
      "settings.headerForeground": "#4c7df7",
      "sideBar.background": color1,
      "sideBar.border": color1,
      "sideBar.foreground": "#a7a1b5",
      "sideBarSectionHeader.background": color1,
      "sideBarSectionHeader.border": color1,
      "sideBarTitle.foreground": "#a7a1b5",
      "statusBar.background": color1,
      "statusBar.border": color1,
      "statusBar.debuggingBackground": color1,
      "statusBar.foreground": "#a7a1b5",
      "statusBar.noFolderBackground": color1,
      "statusBarItem.activeBackground": color1,
      "statusBarItem.prominentBackground": color1,
      "tab.activeBackground": "#1e142e",
      "tab.activeBorder": "#a050e6",
      "tab.activeForeground": "#ebdedb",
      "tab.activeModifiedBorder": "#1e142e",
      "tab.border": color1,
      "tab.inactiveBackground": color1,
      "tab.inactiveModifiedBorder": "#332647",
      "tab.lastPinnedBorder": "#332647",
      "tab.unfocusedActiveBorder": "#332647",
      "tab.unfocusedActiveForeground": "#ebdedb",
      "tab.unfocusedHoverForeground": "#ebdedb",
      "tab.unfocusedInactiveForeground": "#a7a1b5",
      "terminal.ansiBlack": "#45385b",
      "terminal.ansiBlue": "#4c7df7",
      "terminal.ansiBrightBlack": "#574c6a",
      "terminal.ansiBrightBlue": "#4c7df7",
      "terminal.ansiBrightCyan": "#76efe7",
      "terminal.ansiBrightGreen": "#00b667",
      "terminal.ansiBrightMagenta": "#a050e6",
      "terminal.ansiBrightRed": "#f2396d",
      "terminal.ansiBrightWhite": "#faefed",
      "terminal.ansiBrightYellow": "#f7be2b",
      "terminal.ansiCyan": "#51cec7",
      "terminal.ansiGreen": "#007d33",
      "terminal.ansiMagenta": "#7025aa",
      "terminal.ansiRed": "#b70045",
      "terminal.ansiWhite": "#ebdedb",
      "terminal.ansiYellow": "#ef8c24",
      "terminal.background": color1,
      "terminal.selectionBackground": "#4c7df74c",
      "textBlockQuote.background": color1,
      "textCodeBlock.background": color1,
      "textLink.foreground": "#4c7df7",
      "textPreformat.foreground": "#a7a1b5",
      "textSeparator.foreground": "#45385b",
      "titleBar.activeBackground": color1,
      "titleBar.border": color1,
      "titleBar.inactiveBackground": color1,
      "toolbar.activeBackground": "#332647",
      "toolbar.hoverBackground": "#332647",
      "tree.indentGuidesStroke": "#45385b",
      "walkThrough.embeddedEditorBackground": color1,
      "window.activeBorder": color1,
      "window.inactiveBorder": color1,
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
          foreground: "#7b728c",
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
          foreground: "#574c6a",
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
          foreground: "#a7a1b5",
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
          foreground: "#ef8c24",
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
          foreground: "#00b667",
        },
      },
      {
        scope: [
          "constant.other.color",
          "constant.other.color.rgb-value.hex punctuation.definition.constant",
        ],
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: ["invalid", "invalid.illegal"],
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: "invalid.deprecated",
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: "storage.type",
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: ["meta.var.expr storage.type", "storage.modifier"],
        settings: {
          foreground: "#7025aa",
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
          foreground: "#51cec7",
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
          foreground: "#00928c",
        },
      },
      {
        scope: ["keyword.operator.spread", "keyword.operator.rest"],
        settings: {
          fontStyle: "bold",
          foreground: "#f2396d",
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
          foreground: "#32d8ff",
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
          foreground: "#51cec7",
        },
      },
      {
        scope: ["keyword", "keyword.control", "keyword.other.important"],
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: "keyword.other.DML",
        settings: {
          foreground: "#51cec7",
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
          foreground: "#a050e6",
        },
      },
      {
        scope: "entity.name.tag",
        settings: {
          foreground: "#f2396d",
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
          foreground: "#ee8ab2",
        },
      },
      {
        scope: [
          "punctuation.definition.tag",
          "text.html.php meta.embedded.block.html meta.tag.metadata.script.end.html punctuation.definition.tag.begin.html text.html.basic",
        ],
        settings: {
          foreground: "#b64e7c",
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
          foreground: "#f7be2b",
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
          foreground: "#ebdedb",
        },
      },
      {
        scope: "meta.array.literal variable",
        settings: {
          foreground: "#51cec7",
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
          foreground: "#60ddc0",
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
          foreground: "#51cec7",
        },
      },
      {
        scope: "variable.other.object.property",
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope:
          "meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.objectliteral meta.object.member meta.object-literal.key",
        settings: {
          foreground: "#00928c",
        },
      },
      {
        scope: "source.cpp meta.block variable.other",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: "support.other.variable",
        settings: {
          foreground: "#f2396d",
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
          foreground: "#4c7df7",
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
          foreground: "#4c7df7",
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
          foreground: "#f7be2b",
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
          foreground: "#a050e6",
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
          foreground: "#a050e6",
        },
      },
      {
        scope: "entity.other.inherited-class",
        settings: {
          fontStyle: "",
          foreground: "#a050e6",
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
          foreground: "#00928c",
        },
      },
      {
        scope: "entity.name",
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: "support.function",
        settings: {
          foreground: "#00928c",
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
          foreground: "#4c7df7",
        },
      },
      {
        scope: ["support.constant.font-name", "meta.definition.variable"],
        settings: {
          foreground: "#00b667",
        },
      },
      {
        scope: [
          "entity.other.attribute-name.class",
          "meta.at-rule.mixin.scss entity.name.function.scss",
        ],
        settings: {
          foreground: "#00b667",
        },
      },
      {
        scope: "entity.other.attribute-name.id",
        settings: {
          foreground: "#ee8ab2",
        },
      },
      {
        scope: "entity.name.tag.css",
        settings: {
          foreground: "#00928c",
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
          foreground: "#f7be2b",
        },
      },
      {
        scope: "meta.property-list",
        settings: {
          foreground: "#faefed",
        },
      },
      {
        scope: [
          "meta.property-list meta.at-rule.if",
          "meta.at-rule.return variable.parameter.url",
          "meta.property-list meta.at-rule.else",
        ],
        settings: {
          foreground: "#ef8c24",
        },
      },
      {
        scope: [
          "entity.other.attribute-name.parent-selector-suffix punctuation.definition.entity.css",
        ],
        settings: {
          foreground: "#60ddc0",
        },
      },
      {
        scope: "meta.property-list meta.property-list",
        settings: {
          foreground: "#faefed",
        },
      },
      {
        scope: [
          "meta.at-rule.mixin keyword.control.at-rule.mixin",
          "meta.at-rule.include entity.name.function.scss",
          "meta.at-rule.include keyword.control.at-rule.include",
        ],
        settings: {
          foreground: "#a050e6",
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
          foreground: "#7025aa",
        },
      },
      {
        scope: "meta.property-list meta.at-rule.include",
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: "support.constant.property-value",
        settings: {
          foreground: "#ef8c24",
        },
      },
      {
        scope: [
          "entity.name.module.js",
          "variable.import.parameter.js",
          "variable.other.class.js",
        ],
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: "variable.language",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: "variable.other punctuation.definition.variable",
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: [
          "source.js constant.other.object.key.js string.unquoted.label.js",
          "variable.language.this punctuation.definition.variable",
          "keyword.other.this",
        ],
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: [
          "entity.other.attribute-name",
          "text.html.basic entity.other.attribute-name.html",
          "text.html.basic entity.other.attribute-name",
        ],
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: "text.html constant.character.entity",
        settings: {
          foreground: "#00928c",
        },
      },
      {
        scope: [
          "entity.other.attribute-name.id.html",
          "meta.directive.vue entity.other.attribute-name.html",
        ],
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: "source.sass keyword.control",
        settings: {
          foreground: "#4c7df7",
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
          foreground: "#a050e6",
        },
      },
      {
        scope: "markup.inserted",
        settings: {
          foreground: "#00b667",
        },
      },
      {
        scope: "markup.deleted",
        settings: {
          foreground: "#b70045",
        },
      },
      {
        scope: "markup.changed",
        settings: {
          foreground: "#4c7df7",
        },
      },
      {
        scope: "string.regexp",
        settings: {
          foreground: "#76efe7",
        },
      },
      {
        scope: "punctuation.definition.group",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: ["constant.other.character-class.regexp"],
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: [
          "constant.other.character-class.set.regexp",
          "punctuation.definition.character-class.regexp",
        ],
        settings: {
          foreground: "#f7be2b",
        },
      },
      {
        scope: "keyword.operator.quantifier.regexp",
        settings: {
          foreground: "#32d8ff",
        },
      },
      {
        scope: "constant.character.escape.backslash",
        settings: {
          foreground: "#ebdedb",
        },
      },
      {
        scope: "constant.character.escape",
        settings: {
          foreground: "#32d8ff",
        },
      },
      {
        scope: [
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
        ],
        settings: {
          foreground: "#4c7df7",
        },
      },
      {
        scope: "keyword.other.unit",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: "text.html.markdown markup.inline.raw.markdown",
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope:
          "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
        settings: {
          foreground: "#574c6a",
        },
      },
      {
        scope: [
          "heading.1.markdown entity.name",
          "heading.1.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#32d8ff",
        },
      },
      {
        scope: [
          "heading.2.markdown entity.name",
          "heading.2.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#51cec7",
        },
      },
      {
        scope: [
          "heading.3.markdown entity.name",
          "heading.3.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#4c7df7",
        },
      },
      {
        scope: [
          "heading.4.markdown entity.name",
          "heading.4.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#2247af",
        },
      },
      {
        scope: [
          "heading.5.markdown entity.name",
          "heading.5.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#ebdedb",
        },
      },
      {
        scope: [
          "heading.6.markdown entity.name",
          "heading.6.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          fontStyle: "bold",
          foreground: "#a7a1b5",
        },
      },
      {
        scope: ["markup.italic", "markup.italic punctuation"],
        settings: {
          fontStyle: "italic",
          foreground: "#ebdedb",
        },
      },
      {
        scope: ["markup.bold", "markup.bold punctuation"],
        settings: {
          fontStyle: "bold",
          foreground: "#ebdedb",
        },
      },
      {
        scope: [
          "markup.bold markup.italic",
          "markup.bold markup.italic punctuation",
        ],
        settings: {
          fontStyle: "bold italic",
          foreground: "#ebdedb",
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
          foreground: "#574c6a",
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
          foreground: "#60ddc0",
        },
      },
      {
        scope: [
          "markup.fenced_code.block.markdown",
          "markup.inline.raw.string.markdown",
          "variable.language.fenced.markdown",
        ],
        settings: {
          foreground: "#32d8ff",
        },
      },
      {
        scope: "meta.separator",
        settings: {
          fontStyle: "bold",
          foreground: "#7b728c",
        },
      },
      {
        scope: "markup.table",
        settings: {
          foreground: "#faefed",
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: "#4c7df7",
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: "#00928c",
        },
      },
      {
        scope:
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        settings: {
          foreground: "#51cec7",
        },
      },
      {
        scope: "token.info-token",
        settings: {
          foreground: "#00928c",
        },
      },
      {
        scope: "token.warn-token",
        settings: {
          foreground: "#f7be2b",
        },
      },
      {
        scope: "token.error-token",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: "token.debug-token",
        settings: {
          foreground: "#a050e6",
        },
      },
      {
        scope: "entity.tag.apacheconf",
        settings: {
          foreground: "#f2396d",
        },
      },
      {
        scope: ["meta.preprocessor"],
        settings: {
          foreground: "#60ddc0",
        },
      },
      {
        scope: "source.env",
        settings: {
          foreground: "#4c7df7",
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
          foreground: "#faefed",
        },
      },
      {
        scope: ["meta.embedded.block"],
        settings: {
          foreground: "#ebdedb",
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
          foreground: "#ebdedb",
        },
      },
      {
        scope: "punctuation.definition.list_item.markdown",
        settings: {
          foreground: "#faefed",
        },
      },
    ],
  };
  return colorSchema;
};

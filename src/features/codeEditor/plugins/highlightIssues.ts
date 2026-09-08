import {
  Decoration,
  DecorationSet,
  StateField,
  StateEffect,
  EditorView, EditorState
} from '@uiw/react-codemirror';
import { Issue } from '@/lib/types/review';
import { ISSUE_SEVERITY_COLOR_MAP } from '@/lib/config';

export const setIssuesEffect = StateEffect.define<Issue[]>();

export const issueDecorationsField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setIssuesEffect)) {
        return buildIssueDecorations(effect.value, transaction.state);
      }
    }

    if (transaction.docChanged) {
      return Decoration.none;
    }

    return decorations.map(transaction.changes);
  },
  provide: field => EditorView.decorations.from(field)
});

function buildIssueDecorations(issues: Issue[], state: EditorState): DecorationSet {
  const decorations = issues.map(issue => {
    const color = ISSUE_SEVERITY_COLOR_MAP[issue.severity];
    const line = state.doc.line(issue.line);

    return Decoration.line({
      attributes: {
        style: `background-color: ${color}15; border-left: 3px solid ${color};`
      }
    }).range(line.from);
  });

  return Decoration.set(decorations, true);
}

export const issuesField = StateField.define<Issue[]>({
  create: () => [],
  update(issues, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setIssuesEffect)) {
        return effect.value;
      }
    }

    if (transaction.docChanged) {
      return [];
    }
    return issues;
  },
});


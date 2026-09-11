import {
  Decoration,
  DecorationSet,
  StateField,
  StateEffect,
  EditorView, EditorState,
  Transaction
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
      const changedLines = getChangedLineNumbers(transaction);
      const mapped = decorations.map(transaction.changes);
      return mapped.update({
        filter: (from) => {
          const lineNum = transaction.state.doc.lineAt(from).number;
          return !changedLines.has(lineNum);
        }
      });
    }

    return decorations.map(transaction.changes);
  },
  provide: field => EditorView.decorations.from(field)
});

function getChangedLineNumbers(transaction: Transaction): Set<number> {
  const changedLines = new Set<number>();
  transaction.changes.iterChangedRanges((_fromA, _toA, fromB, toB) => {
    const doc = transaction.state.doc;
    const startLine = doc.lineAt(fromB).number;
    const endLine = doc.lineAt(toB).number;
    for (let i = startLine; i <= endLine; i++) {
      changedLines.add(i);
    }
  });
  return changedLines;
}

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
      const oldDoc = transaction.startState.doc;
      const newDoc = transaction.state.doc;

      const oldChangedLines = new Set<number>();
      transaction.changes.iterChangedRanges((fromA, toA) => {
        const startLine = oldDoc.lineAt(fromA).number;
        const endLine = oldDoc.lineAt(toA).number;
        for (let i = startLine; i <= endLine; i++) {
          oldChangedLines.add(i);
        }
      });

      return issues
        .filter(issue => !oldChangedLines.has(issue.line))
        .map(issue => {
          const oldFrom = oldDoc.line(issue.line).from;
          const newFrom = transaction.changes.mapPos(oldFrom);
          const newLine = newDoc.lineAt(newFrom).number;
          return { ...issue, line: newLine };
        });
    }
    return issues;
  },
});


import { EditorView, hoverTooltip } from '@uiw/react-codemirror';

import { issuesField } from './highlightIssues';

const hoverIssueTooltipTheme = EditorView.baseTheme({
  '.cm-tooltip.cm-tooltip-hover': {
    backgroundColor: '#0d0d2b',
    color: '#dfdfe2',
    border: '#2a2a5a',
    padding: '12px',
    borderRadius: '8px',
    maxHeight: '220px',
    overflow: 'auto',
    maxWidth: '320px',
    '& .cm-tooltip-arrow:before': {
      borderTopColor: '#2a2a5a'
    },
    '& .cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  }
});

const hoverIssueTooltipBuild = hoverTooltip((view, pos) => {
  const issues = view.state.field(issuesField, false) ?? [];
  const { number } = view.state.doc.lineAt(pos);
  const issue = issues.find((item) => item.line === number);

  if (issue) {
    return {
      pos,
      end: pos,
      above: true,
      create() {
        const dom = document.createElement('div');
        dom.textContent = issue.message;
        return { dom };
      },
    };
  }

  return null;
});

export const hoverIssueTooltip = [hoverIssueTooltipBuild, hoverIssueTooltipTheme];
import {EditorView, hoverTooltip} from "@uiw/react-codemirror";
import {Issue} from "@/lib/types";

const hoverIssueTooltipTheme = EditorView.baseTheme({
    ".cm-tooltip.cm-tooltip-hover": {
        backgroundColor: "#12123a",
        color: "#dfdfe2",
        border: "#2a2a5a",
        padding: "12px",
        borderRadius: "8px",
        maxHeight: '220px',
        maxWidth: '320px',
        "& .cm-tooltip-arrow:before": {
            borderTopColor: "#2a2a5a"
        },
        "& .cm-tooltip-arrow:after": {
            borderTopColor: "transparent"
        }
    }
});

const hoverIssueTooltipBuild = (issues: Issue[]) => hoverTooltip((view, pos) => {
    const {number} = view.state.doc.lineAt(pos);
    const issue = issues.find(issue => issue.line === number);

    if(issue) {
        return {
            pos: pos,
            end: pos,
            above: true,
            create() {
                const dom = document.createElement('div');
                dom.textContent = issue.message

                return { dom }
            }
        }
    }

    return null;
})

export function hoverIssueTooltip(issues: Issue[]) {
    return [hoverIssueTooltipBuild(issues), hoverIssueTooltipTheme]
}

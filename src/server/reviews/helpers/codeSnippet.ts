export function normalizeCodeSnippet(codeSnippet: string): string {
  return codeSnippet.replace(/\r\n?/g, '\n').replace(/\s+$/g, '');
}

export function countCodeLines(codeSnippet: string): number {
  return normalizeCodeSnippet(codeSnippet).split('\n').length;
}

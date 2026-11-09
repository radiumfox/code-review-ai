export const sanitizeCodeSnippet = function (input: string) {
  return input.replace(/\r\n?/g, '\n').replace(/\s+$/g, '');
};

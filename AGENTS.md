## Summary

This is a Next.js application featuring AI-powered code reviews with structured feedback on bugs, security, and code style.

## Workflow
- Never edit based on a stale view of the file: before applying any changes to a file, always read the file's current content.

## Package Manager Specification
- Use pnpm for all dependency operations and scripts;
- Pin exact, caret-less versions in `package.json`.

## Language and Frameworks Specification

### TypeScript
- TypeScript strict mode;
- Use `interfaces` instead of `types` where possible;
- Put type/interface definitions in a dedicated `types.ts` co-located with the related code;
- Use an `index.ts` in each folder to re-export all definitions and variables;
- Use only named exports.

Do not use the following features:
- "any" for typing;
- type assertions.

## Code review

1. Highlight bugs and style flaws on the current branch;
2. Mark them from critical to small;
3. Suggest ways to fix them;

## General code style
- Single quotes
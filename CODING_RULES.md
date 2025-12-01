# Coding Rules & Standards

This document outlines the coding rules and standards enforced in this project.

## Linting & Formatting

### ESLint

- **Configuration**: `.eslintrc.json`
- **Extends**: Next.js core web vitals + Prettier
- **Rules Enforced**:
  - Prettier formatting errors are treated as ESLint errors
  - React Hooks exhaustive deps warnings
  - TypeScript unused variables warnings (with `_` prefix exception)
  - Console statements warnings (only `console.warn` and `console.error` allowed)

### Prettier

- **Configuration**: `.prettierrc`
- **Rules**:
  - Semicolons: Required
  - Quotes: Double quotes
  - Print width: 80 characters
  - Tab width: 2 spaces
  - Trailing commas: ES5 compatible
  - Arrow parens: Always include
  - End of line: LF (Unix-style)

### TypeScript

- **Strict mode**: Enabled
- **Configuration**: `tsconfig.json`
- **Rules**:
  - All strict type checking enabled
  - No implicit any
  - Strict null checks
  - No unused locals/parameters (with `_` prefix exception)

## Pre-commit Hooks

### Husky

- **Pre-commit hook**: Runs `lint-staged` before every commit
- **What it does**: Automatically lints and formats staged files

### Lint-staged

- **Configuration**: `.lintstagedrc.json`
- **Runs on**:
  - JavaScript/TypeScript files: ESLint fix + Prettier
  - JSON, Markdown, CSS, HTML, YAML files: Prettier only

## Commands

```bash
# Run ESLint (via Next.js)
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

**Note**: The `npm run lint` command uses Next.js's built-in ESLint integration. For direct ESLint usage, you may need to use ESLint 9's flat config format, but Next.js handles this automatically.

## Best Practices

1. **Always run linting before committing**: The pre-commit hook will catch most issues, but it's good practice to run `npm run lint` before pushing.

2. **Use TypeScript strictly**: Avoid `any` types. Use proper types or `unknown` when necessary.

3. **Follow React best practices**:
   - Use functional components
   - Properly handle dependencies in hooks
   - Avoid console.log in production code

4. **Naming conventions**:
   - Components: PascalCase
   - Functions/variables: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Files: Match the export (PascalCase for components, camelCase for utilities)

5. **Unused variables**: Prefix with `_` if intentionally unused (e.g., `_unusedParam`)

## Git Workflow

1. Make changes
2. Stage files (`git add`)
3. Commit (`git commit`) - pre-commit hook runs automatically
4. If hook fails, fix issues and commit again

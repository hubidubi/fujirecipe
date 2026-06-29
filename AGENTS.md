# Instructions

## Main goals
- Simple, easy to use, and intuitive user interface.
- Solution should be a Progressive Web App (PWA).

## General
- Write **production-ready**, maintainable, clean code.
- Follow the existing **code style** and structure.
- Reuse and extend existing **utility classes and helpers**.
- Don't use deprecated libraries or features.

## Reasoning & Suggestions
- If a better **implementation**, **library**, or **algorithm** exists, **propose** before implementing.
- Prioritize **readability**, **simplicity**, and **performance**.

## TypeScript/JavaScript
- Use idiomatic TypeScript/JavaScript syntax and the **latest features**.
- Use **async/await** for asynchronous operations.
- Write native TypeScript, Javascript code.
- Use the latest TypeScript, Javascript libraries.
- Use the latest TypeScript, Javascript features.
- All code should be compatible with TypeScript 5.0 and Node.js 18+.
- Use **ES6+** syntax and features.
- Use **TypeScript** for type safety and better tooling.
- Use **ESLint** for linting and code quality.
- Use **Prettier** for code formatting.
- Use **React** for the frontend.
- Use **Workbox** for PWA service worker and caching.

## Version Control
- Use **Git**. Follow a clean and rebased history unless there's a reason not to.
- Use meaningful commit messages.
- Always add `.gitignore` file to the repository and add the following rules:
```
.idea
.vscode
*.iml
*.log
*.class
*.jar
*.war
*.ear
*.db
*.DS_Store
```

## Build
- Use **Vite** for the build tool.

## Documentation
- Always create a `README.md` file in the root directory and keep it up to date.
- `README.md` should include:
  - Project description
  - Installation instructions
  - Usage instructions
  - Contribution guidelines
  - License information

## Testing
- Use **Jest** for testing.
- Target 85%+ test coverage.
- Write unit tests for all public methods and classes.
- Include tests with all new functionality.
- Extract test fixtures into dedicated fixture classes when multiple test cases use similar test data or use `beforeEach` to set up common test data.
- Use **React Testing Library** for testing React components.
- Use **Mock Service Worker (MSW)** for mocking API calls in tests.

## Deployment
- Use **GitHub Pages** for deployment.
- Use **gh-pages** branch for deployment.
- Use local git hook to automate deployment by running `deploy.sh`

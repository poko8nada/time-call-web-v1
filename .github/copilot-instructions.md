You are a programming expert.

## Prerequisites

### 1. Language Policy

- Always think, reason, and write code in English.
- Always respond to user instructions and questions in **Japanese**, unless explicitly requested otherwise.
- Use natural and fluent Japanese suitable for professional technical communication.
- Do not translate variable names or identifiers into Japanese.

### 2. Communication Guidelines

- Keep user-facing content within 3 lines unless user requests detailed explanation
- Use concise, telegraphic style to minimize response volume
- Focus on actionable information and results
- Avoid unnecessary explanations or commentary

### 3. Foundational programming knowledge
- Utilize recent, stable versions for all adopted frameworks, libraries, and languages.
- Use Context7 as needed for code generation, setup, configuration, or library/API documentation.
- The Context7 MCP tools will automatically handle library ID resolution and documentation retrieval.
- If use Next.js 15+ with App Router, prefer Server Actions over traditional API Routes.

### 4. File Management and Task Execution

- Always reference the following md files before implementation, even without specific instructions:
  - `docs/*.md` contains basic requirements and specifications
- Maintain traceability between requirements, tasks, and implementation

### 5. Task Granularity Policy

- Maximum of 5 files can be created, modified, or deleted per single task
- This limit defines the maximum granularity for one task
- When work requires changes to more than 5 files, split into multiple tasks
- Ensure each task remains focused and manageable

### 6. Development and Testing Approach

- Break down implementation into small, granular tasks
- Start development environment after each small task completion
- Verify intended behavior through testing before proceeding:
  - Use Vitest for minimal unit tests colocated with source files:
  - e.g., `*.test.tsx` next to components/hooks/actions
- Confirm functionality matches expected outcomes:
  - Focus on isolated tests of key logic: server actions, hooks, minimal clients in `_features/` with React Testing Library
- Run tests via `npm test`: Vitest: `vitest.config.ts` with jsdom; scan `**/*.test.{ts,tsx}`
- Prioritize server verification in page.tsx (mock fetches); isolate clients in `_features/`; avoid E2E, keep tests fast/granular

### 7. Token Management and Task Continuity

- Monitor subtask workload and token consumption
- When approaching 100k tokens, generate separate continuation task
- Transfer all necessary information for persistence including:
  - Completed work summary
  - Current progress state
  - Remaining tasks and context
  - Implementation decisions made
- Ensure seamless handoff between task segments

### 8. Solution Quality Standards

- Avoid ad-hoc solutions (hardcoding, manual operation assumptions, etc.)
- Design scalable and maintainable solutions from the beginning
- Consider long-term implications of implementation choices

### 9. Error Response Protocol

- When user reports issues or unexpected errors occur during development:
  - Do not immediately attempt fixes
  - First analyze the situation thoroughly
  - Present situation assessment and proposed solution options to user
  - Wait for user confirmation before proceeding with implementation

### 10. Documentation Creation Policy

- Do not create implementation md files unless explicitly instructed by user
- Do not ask user about documentation creation
- Focus on code implementation over documentation unless specified

### 11. Documentation Maintenance

- Pause work at appropriate intervals to update project documentation
- Update `md` that related to your tasks and documentation files in project
- Maintain current status and progress tracking
- Document implementation decisions and rationale

---

## Git Workflow Rules

### Commit Message Format

```
<type>: <description>
```

### Commit Types

- **feat**: Add new features
- **refactor**: Code restructuring and improvements
- **fix**: Bug fixes
- **update**: Update existing functionality
- **style**: Styling and visual adjustments
- **chore**: Maintenance and housekeeping tasks
- **WIP**: Work in progress

### Commit Message Guidelines

- Use English for all commit messages
- Use imperative mood (Add, Update, Implement, Fix, etc.)
- Start description with lowercase letter
- No period at the end
- Be specific and concise about what was changed
- Include component or file names when relevant
- Use "and" to connect multiple related changes in one commit

### Examples

```
feat: implement contact form and related refactorings
refactor: enhance resume merging functionality and add skills support
fix: update profile image dimensions in header component
chore: update project files
style: adjust typography for improved readability
```

### Branch Strategy

- Use feature branches for new development
- Follow naming convention: `feature/<feature-name>`
- Merge to `develop` branch for integration
- Use pull requests for code review process

---

## Coding Rules

- Design by Functional Domain Modeling.
- Use function. Do not use `class`.
- Design types using Algebraic Data Types.
- Use early return pattern to improve readability.
- Avoid deep nesting with `else` statements.
- Handle error cases first with early return.

### Type Safety Requirements

- Never use `any` type. Always define explicit types.
- Resolve type errors immediately when they occur.
- Use proper TypeScript utilities and type inference.
- Prefer union types and discriminated unions for complex scenarios.

### Error Handling Strategy

- Prefer `Result<T, E>` pattern over `throw` for error management in internal logic and domain functions.
  - This enables explicit and type-safe error propagation.
- For external operations (I/O, database, fetch, etc.), `try-catch` is acceptable.
  - Always log errors to the console using `console.error(error)` in `catch` blocks.
- Avoid using exceptions for control flow.

#### Result Example

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseId(input: unknown): Result<string, "Invalid ID"> {
  return typeof input === "string" && input !== ""
    ? { ok: true, value: input }
    : { ok: false, error: "Invalid ID" };
}
```

#### External Error Example

```ts
try {
  const res = await fetch(...);
  if (!res.ok) {
    console.error("Fetch failed:", res.statusText);
    return { ok: false, error: "Fetch failed" };
  }
} catch (error) {
  console.error("Unexpected error during fetch:", error);
  return { ok: false, error: "Unexpected error" };
}
```

---

## Project Structure

```
my-nextjs-app/
├─ app/                          # App Router routing base (default: no src). Structure reflects routing; for feature placement. Primarily server components for async/await.
│   ├ dashboard/                   # /dashboard route: parallel routes example for multi-part screens.
│   │  ├ @modal/                   # Parallel route: modal part.
│   │  │  └page.tsx               # Modal content (colocation: route-specific)
│   │  ├@search/                  # Parallel route: search part.
│   │  │  └page.tsx               # Search content (colocation)
│   │  ├page.tsx                  # /dashboard main page (server component; fetch data here)
│   │  ├ _components/              # Route-specific reusable UI (non-routed: _ prefix). No logic/process.
│   │  │  ├ui─*.tsx               # Reusable UI (e.g., DashboardButton.tsx)
│   │  │  └*.tsx                  # Feature UI (e.g., DashboardChart.tsx)
│   │  ├ _features/                # Route-specific processing/rendering (colocation). Combine components; import to app routes.
│   │  │  │                       # No nesting in features! Use children in app/. Client hooks OK; server OK. Keep clients small/minimal.
│   │  │  └DashboardFeature.tsx   # e.g., Main feature (hooks/config integration; minimal client)
│   │  ├ _hooks/                   # Route-specific hooks (colocation).
│   │  │  └useDashboard.ts        # e.g., useSearch (config types)
│   │  ├ _actions/                 # Route-specific server actions (colocation: non-routed). 'use server' mutations.
│   │  │  ├actions.ts             # e.g., createDashboardItem(formData: FormData) { 'use server'; ... }
│   │  │  └actions.test.ts        # Minimal unit tests colocated; mock DB/API for mutation success/error.
│   │  └_config/                  # Route-specific config (colocation). Initial objects/types for hooks/actions.
│   │      └dashboardConfig.ts    # e.g., API endpoints with types
│   │
│   ├blog/                        # /blog route: general example without parallel routes.
│   │  ├page.tsx                  # /blog main page (server component; lists posts)
│   │  ├ _components/              # Blog-specific reusable UI (non-routed). No logic/process.
│   │  │  ├ui─*.tsx               # Reusable UI (e.g., PostCard.tsx)
│   │  │  └*.tsx                  # Feature UI (e.g., BlogSidebar.tsx)
│   │  ├ _features/                # Blog-specific processing/rendering (colocation). Combine components; import to app.
│   │  │  │                       # No nesting! Use children in app/. Client hooks OK; server OK. Keep clients small.
│   │  │  └BlogFeature.tsx        # e.g., Post renderer (data fetching; minimal client)
│   │  ├ _hooks/                   # Blog-specific hooks (colocation).
│   │  │  └useBlog.ts             # e.g., usePosts (config types)
│   │  ├ _actions/                 # Blog-specific server actions (colocation). Mutations like create post.
│   │  │  ├actions.ts             # e.g., createPost(formData: FormData) { 'use server'; ... }
│   │  │  └actions.test.ts        # Minimal tests; cover form validation/errors.
│   │  └_config/                  # Blog-specific config (colocation). Initial objects/types.
│   │      └blogConfig.ts         # e.g., Post schema with types
│   │
│   ├layout.tsx                   # Root layout (server component)
│   └page.tsx                     # Root page (/): server component; encapsulate client components below (e.g., in _features for minimal clients)
│
├─ components/                   # Global shared reusable UI (root level). No logic/process. Easy imports.
│   ├ui─*.tsx                     # Shared UI (e.g., Button.tsx)
│   └*.tsx                        # Shared features (e.g., AuthForm.tsx)
│
├─ hooks/                        # Global shared hooks (root level). Use config types.
│   └useGlobal.ts                 # e.g., useAuth (server actions compatible)
│
├─ utils/                          # Global utilities/config (root level). Types for hooks/actions.
│   ├actions.ts                   # Global server actions. 'use server' mutations (e.g., loginUser).
│   ├config.ts                    # App-wide settings with types (inject to hooks)
│   └utils.ts                     # General utils (e.g., formatDate)
│
├─ public/                       # Static assets
```

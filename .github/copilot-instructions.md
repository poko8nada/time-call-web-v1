You are a programming expert. Must follow these guidelines strictly.

## Language and Communication Policy

- Always think, reason, and write code in English.
- Always respond to user instructions and questions in **Japanese**, unless explicitly requested otherwise.
- Reduce redundancy: Provide concise, focused responses. Include only what is asked; unnecessary explanations or additions are not required.
- Avoid unnecessary explanations, commentary and emojis
- Do not translate variable names or identifiers into Japanese.

## Task Execution Policy

### Boundaries

- **Stability is paramount**: Execute instructions precisely as given, without adding or omitting steps.
- **When unclear**: Do not speculate; request clarification.
- Reference `docs/*.md` for requirements before implementation
- Aim for a maximum of 5 files per task (creation/modification/deletion).
- Ask first. Database schema changes, adding dependencies, modifying CI/CD config
- Never commit secrets or API keys, edit `node_modules/` or `vendor/

### Development Workflow

**Even for very small tasks or urgent requests, always obtain approval for each workflow.**

1. List tasks and files (create/modify/delete) → **Get approval**
2. Run `pnpm test *.test.tsx`
3. If tests fail → Investigate, propose fixes → **Get approval** → Execute fixes
4. Create and ask staging files list and commit message → **Get approval** → `git add` and `git commit`
5. Check off completed task in the task markdown file

## Tools

- Use pnpm as the package manager for all dependency management and script execution.
- Except for universal best practices, always assume your knowledge is outdated and consult Context7 MCP tools.
- The Context7 will automatically handle library ID resolution and documentation retrieval.
- When developing with Next.js, actively use “Next-devtools”. You can review component etc. in real-time.

## Testing Policy

- No E2E tests
- Write minimal unit tests only
- Test business logic and critical functions only
- Skip UI components and trivial code
- Place `*.test.ts(x)` files adjacent to source files

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test *.test.tsx   # Run specific tests
```

---

## Standard Coding Rules

### Boundaries

- Design by Functional Domain Modeling.
- Use function. Do not use `class`.
- Design types using Algebraic Data Types.
- Use early return pattern to improve readability.
- Avoid deep nesting with `else` statements.
- Handle error cases first with early return.

### 3.1. Next.js 15+ App Router Component rules

If using Next.js App Router:

- **Server Components (default)**: `page.tsx`, `layout.tsx` are always server components
- **Client Components**: Place in `_features/` or `_components` directory only, keep minimal
- **Data flow**: Fetch data in Server Components, pass as props to Client Components
- **Rationale**: Maximize server-side rendering, minimize client bundle size

### Type Safety Requirements

- Never use `any` type. Always define explicit types.
- Also, avoid "type assertions" (`as` keyword) as much as possible.
- Resolve type errors immediately when they occur.
- Use proper TypeScript utilities and type inference.
- Prefer union types and discriminated unions for complex scenarios.

### Error Handling Strategy

- Avoid ad-hoc solutions (hardcoding, manual operations)
- Design for scalability and maintainability
- When errors occur: analyze first, propose solutions, wait for confirmation

**Use Result<T, E> pattern for:**

- Internal logic and domain functions
- Server Actions returning success/error states
- Hooks managing operation outcomes
- Enables explicit, type-safe error propagation

**Use try-catch for:**

- External operations (I/O, database, fetch, file system)
- Always log errors: `console.error(error)` in catch blocks

**Never use exceptions for control flow**

## Result Pattern Examples

**Type Definition:**

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

**Domain Function:**

```ts
function parseId(input: unknown): Result<string, "Invalid ID"> {
  return typeof input === "string" && input !== ""
    ? { ok: true, value: input }
    : { ok: false, error: "Invalid ID" };
}
```

**Server Action:**

```ts
"use server";
export async function createPost(
  formData: FormData,
): Promise<Result<Post, string>> {
  const title = formData.get("title");
  if (!title) return { ok: false, error: "Title required" };

  try {
    const post = await db.insert({ title });
    return { ok: true, value: post };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to create post" };
  }
}
```

**Hook Usage:**

```ts
function useCreatePost() {
  const [result, setResult] = useState<Result<Post, string> | null>(null);

  const create = async (formData: FormData) => {
    const res = await createPost(formData);
    setResult(res);
    return res;
  };

  return { create, result };
}
```

**External Operation:**

```ts
try {
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Fetch failed:", res.statusText);
    return { ok: false, error: "Fetch failed" };
  }
  const data = await res.json();
  return { ok: true, value: data };
} catch (error) {
  console.error("Network error:", error);
  return { ok: false, error: "Network error" };
}
```

---

## Project Structure

### Boundaries

- **Colocation**: Route-specific files use `_prefix` (non-routed) and live within route directories
- **Parallel routes**: Use `@folder` for multi-part layouts
- **Dynamic routes**: Use `[param]` for dynamic segments
- **Route Grouping**: Use `(group)` for related routes
- **Components**:
  - Small UI pieces.
  - Always components are children of Features. Do not import Features into Components.
- **Features**:
  - It is Large size Components that combine multiple smaller components, hooks, and logic
  - File is named like `DisplayUserProfile.tsx` not `UserProfileFeature.tsx`
  - Combine components in `_features/`; keep client logic minimal
  - No nesting in features Use children in `app/` routing structure instead
- **Global types**: Only truly universal types (e.g., Result<T, E>) go in `utils/types.ts`

### Structure Example

```
my-nextjs-app/
├─ app/                          # App Router: routing structure
│   ├ dashboard/                 # Route: /dashboard
│   │  ├ @modal/                 # Parallel route
│   │  │  └page.tsx
│   │  ├ @search/                # Parallel route
│   │  │  └page.tsx
│   │  ├ page.tsx                # Main page (server component)
│   │  ├ _components/            # Route-specific UI
│   │  ├ _features/              # Route-specific logic/rendering
│   │  ├ _hooks/                 # Route-specific hooks
│   │  ├ _actions/               # Route-specific server actions
│   │  └ _config/                # Route-specific config
│   │
│   ├ blog/                      # Route: /blog
│   │  ├ page.tsx
│   │  ├ [slug]/                  # Dynamic route: /blog/:slug
│   │  │  └ page.tsx
│   │  ├ _components/
│   │  ├ _features/
│   │  ├ _hooks/
│   │  ├ _actions/
│   │  └ _config/
│   │
│   ├ (root)/                    # Can be omitted, Route: /
│   │  ├ page.tsx                # Root page (/)
│   │  ├ _components/
│   │  ├ _features/
│   │  ├ _hooks/
│   │  ├ _actions/
│   │  └ _config/
│   │
|   ├ page.tsx                   # Fallback root page (if no (root)/)
│   └ layout.tsx                 # Root layout
│
├─ components/                   # Global shared UI
├─ hooks/                        # Global shared hooks
├─ utils/                        # Global utilities/config/actions/types
│   └ types.ts                   # Global types (e.g., Result<T, E>)
└─ public/                       # Static assets
```

---

## Git Workflow

### Basic

- **Commit Format:** `<type>: <description>`
- **Types:** feat, fix, refactor, chore, style, WIP

### Rules

- English, imperative mood (Add, Update, Fix)
- Lowercase description, no period
- Be specific and concise

### Examples

```
feat: implement contact form with validation
fix: resolve type error in dashboard hook
refactor: simplify user authentication flow
```

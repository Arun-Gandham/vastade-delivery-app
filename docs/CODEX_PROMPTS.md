# Codex Prompts

## Full-stack development prompt

```md
Read the documentation in this order:

1. docs/product/README.md
2. all docs/product files
3. docs/backend/README.md
4. all docs/backend files
5. docs/frontend/README.md
6. all docs/frontend files

Important:
- docs/product is the shared source of truth for roles, flows, APIs, statuses, and business rules.
- docs/backend contains backend implementation details.
- docs/frontend contains frontend implementation details.
- docs/_original-unchanged contains the original uploaded docs for verification only.
- The implementation output should match the same scope as the original backend and frontend docs.
- Do not remove any feature from the original scope.
- Do not add undocumented future features.
- Do not rewrite unrelated code.
```

## Backend-only change prompt

```md
Read docs/product first, then docs/backend.

Apply only backend changes required by the updated docs.
Do not modify frontend code unless the change request says full-stack.
```

## Frontend-only change prompt

```md
Read docs/product first, then docs/frontend.

Apply only frontend changes required by the updated docs.
Do not modify backend code unless the change request says full-stack.
```

## Full-stack change prompt

```md
Read the latest entry in docs/product/06-change-requests.md.

Then update affected product, backend, and frontend code only.
Show changed files at the end.
```

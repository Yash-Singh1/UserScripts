---
name: create-userscript
description: Create or add Tampermonkey/Greasemonkey userscripts to the Yash-Singh1/UserScripts repo using the repo-standard template. Use when the user gives a raw userscript, asks to add a userscript, provides userscript metadata/code/target URLs, or wants the behavior of create-userscript.js without the interactive human prompt.
---

# Create Userscript

Use this skill to add a userscript entry to the `UserScripts` repo without running the interactive `create-userscript.js` prompt.

## Workflow

1. Inspect the repo first:
   - Read `create-userscript.js` if the local template may have changed.
   - Check `git status --short --branch --untracked-files=all`.
2. Normalize the request into:
   - `name`
   - `description`
   - one or more `@match` URL patterns
   - optional `icon`, `keywords`, `grant`, `run-at`, `require`, `sandbox`, or other userscript metadata
   - runtime code body, or a complete raw userscript
3. Run `scripts/create_userscript.ts` with Bun from this skill. Prefer this helper over driving the interactive generator.
4. Run repo formatting/lint checks on touched files.
5. Report created files and any pre-existing dirty worktree entries that were left untouched.

## Helper

The helper writes the same repo surfaces as `create-userscript.js`:

- `<Name_With_Underscores>/<Name_With_Underscores>.user.js`
- `<Name_With_Underscores>/README.md`
- a `<userscript-card>` in `docs/index.html`

It always generates repo-standard metadata for namespace, author, homepage, support, license, download, and update URLs. When given a full raw userscript, it parses the metadata block, keeps the runtime body, preserves target URLs and useful userscript metadata, and replaces non-repo template fields.

Structured example:

```bash
bun .codex/skills/create-userscript/scripts/create_userscript.ts \
  --repo /path/to/UserScripts \
  --name "Example Script" \
  --description "Does the thing" \
  --match "https://example.com/*" \
  --icon "https://www.google.com/s2/favicons?sz=64&domain=example.com" \
  --keywords "example thing" \
  --code-file /tmp/example-body.js
```

Raw userscript example:

```bash
bun .codex/skills/create-userscript/scripts/create_userscript.ts \
  --repo /path/to/UserScripts \
  --raw-file /tmp/example.user.js \
  --keywords "example thing"
```

JSON spec example:

```json
{
  "name": "Example Script",
  "description": "Does the thing",
  "match": ["https://example.com/*"],
  "icon": "https://www.google.com/s2/favicons?sz=64&domain=example.com",
  "keywords": ["example", "thing"],
  "run_at": "document-start",
  "code": "(function () {\\n  'use strict';\\n})();"
}
```

Run with:

```bash
bun .codex/skills/create-userscript/scripts/create_userscript.ts \
  --repo /path/to/UserScripts \
  --spec /tmp/spec.json
```

## Validation

After generating, run targeted checks:

```bash
pnpm exec eslint New_Script/New_Script.user.js
pnpm exec prettier --check New_Script/New_Script.user.js New_Script/README.md docs/index.html
```

If `docs/index.html` needs formatting, run Prettier on that file and recheck. Do not format unrelated dirty files unless the user asks.

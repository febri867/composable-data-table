# Publishing Guide

This repository publishes the **library only**. The home page, `/docs` playground, Storybook stories, fixture data, and demo-only CSS are not part of the public package entry point.

## Release checklist

1. Update `CHANGELOG.md`.
2. Bump the version in `package.json`.
3. Run the quality gate:

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

4. Validate the package:

```bash
npm run publish:check
```

5. Inspect the generated package with `npm pack --dry-run`.
6. Commit and create a release tag `v0.1.9`.
7. Publish to the required registry.

## Environment files

Start from `.env.example` for publishing variables:

```bash
cp .env.example .env.publish.local
```

Use `.env.local.example` only for browser-safe demo configuration. Never put registry credentials in `VITE_*` variables.

Do **not** commit `.env.publish.local` or any file containing a real token.

### npm

Required:

```text
NPM_TOKEN
```

Create an npm access token with the minimum permission required to publish the package. For CI, store it as a protected/masked secret named `NPM_TOKEN`.

Local publish:

```bash
NPM_TOKEN=... npm run publish:npm
```

The publish helper creates a temporary npm config and removes it after publishing, so the token is not written to the repository `.npmrc`.

## GitLab Package Registry

Local publish requires:

```text
GITLAB_TOKEN
GITLAB_PROJECT_ID
GITLAB_API_V4_URL   # optional; defaults to https://gitlab.com/api/v4
```

Run:

```bash
GITLAB_TOKEN=... \
GITLAB_PROJECT_ID=123456 \
npm run publish:gitlab
```

The script resolves the registry as:

```text
${GITLAB_API_V4_URL}/projects/${GITLAB_PROJECT_ID}/packages/npm/
```

### GitLab CI

Prefer GitLab's built-in job token rather than a long-lived personal token:

```text
CI_JOB_TOKEN
CI_PROJECT_ID
CI_API_V4_URL
```

The pipeline can therefore publish without storing an additional GitLab registry secret when the project permissions allow `CI_JOB_TOKEN` package writes.

## GitLab CI variables

Recommended protected/masked variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NPM_TOKEN` | npm release | npm registry authentication |
| `GITLAB_TOKEN` | local / external CI | GitLab registry authentication |
| `GITLAB_PROJECT_ID` | local / external CI | Target GitLab project |
| `CI_JOB_TOKEN` | GitLab CI | Built-in GitLab package authentication |
| `CI_PROJECT_ID` | GitLab CI | Built-in project identifier |
| `CI_API_V4_URL` | GitLab CI | Built-in GitLab API base URL |

Never put credentials in:

- source files
- `package.json`
- committed `.npmrc`
- README examples
- Storybook configuration
- browser-side `VITE_` variables

## NPM registry

The package uses the public npm registry through `publishConfig`:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

Publish:

```bash
npm run publish:npm
```

The package must be versioned before each release. npm will reject publishing the same package/version twice.

## GitLab registry

Publish:

```bash
npm run publish:gitlab
```

The registry is passed explicitly to `npm publish`, so the GitLab release cannot accidentally overwrite the npm registry configuration.

## Package artifact

To create a distributable tarball:

```bash
npm run pack
```

The tarball is written to:

```text
artifacts/*.tgz
```

Inspect it before a release:

```bash
npm pack --dry-run
```

Expected public surface:

```text
dist/
README.md
LICENSE
CHANGELOG.md
docs/
```

Demo application source and fixtures should not appear in the package's public exports.

## CI release flow

```text
commit
  |
  v
quality
  |-- typecheck
  |-- lint
  |-- unit tests
  |-- app build
  |
  v
package
  |-- library build
  |-- npm pack
  |-- dist artifact
  |
  +-------------------+
  |                   |
  v                   v
npm registry      GitLab registry
```

Release jobs should run only for an intentional release tag.

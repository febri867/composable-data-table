import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const command = process.argv[2] ?? 'check'
const root = process.cwd()
const npmToken = process.env.NPM_TOKEN
const gitlabToken = process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN
const gitlabProjectId = process.env.GITLAB_PROJECT_ID || process.env.CI_PROJECT_ID
const gitlabApi = process.env.GITLAB_API_V4_URL || process.env.CI_API_V4_URL || 'https://gitlab.com/api/v4'

function run(file, args, env = process.env) {
  execFileSync(file, args, { cwd: root, env, stdio: 'inherit' })
}

function check() {
  run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build:package'])
  run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['pack', '--dry-run'])
}

function npmPublish() {
  if (!npmToken) throw new Error('NPM_TOKEN is required for npm publishing.')
  const configDir = join(root, '.publish-tmp')
  const userConfig = join(configDir, '.npmrc')
  mkdirSync(configDir, { recursive: true })
  writeFileSync(userConfig, `//registry.npmjs.org/:_authToken=${npmToken}\n`)
  try {
    const env = { ...process.env, NPM_CONFIG_USERCONFIG: userConfig }
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['publish', '--access', 'public'], env)
  } finally {
    rmSync(configDir, { recursive: true, force: true })
  }
}

function gitlabPublish() {
  if (!gitlabToken) throw new Error('GITLAB_TOKEN or CI_JOB_TOKEN is required for GitLab publishing.')
  if (!gitlabProjectId) throw new Error('GITLAB_PROJECT_ID or CI_PROJECT_ID is required for GitLab publishing.')

  const registry = `${gitlabApi}/projects/${gitlabProjectId}/packages/npm/`
  const host = new URL(registry).host
  const configDir = join(root, '.publish-tmp')
  const userConfig = join(configDir, '.npmrc')
  mkdirSync(configDir, { recursive: true })
  writeFileSync(userConfig, `//${host}/:_authToken=${gitlabToken}\nregistry=${registry}\n`)

  try {
    const env = { ...process.env, NPM_CONFIG_USERCONFIG: userConfig }
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['publish', '--registry', registry], env)
  } finally {
    rmSync(configDir, { recursive: true, force: true })
  }
}

if (!existsSync(join(root, 'package.json'))) {
  throw new Error('Run the publish script from the repository root.')
}

if (command === 'check') check()
else if (command === 'npm') npmPublish()
else if (command === 'gitlab') gitlabPublish()
else throw new Error(`Unknown publish command: ${command}`)

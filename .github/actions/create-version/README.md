# Create version action

This action using [git-chglog][git-chglog] internally to create git tag and Github Release with release note.

[git-chglog]: https://github.com/git-chglog/git-chglog

## Prerequisite

This action requires **action/checkout** fetch-depth to be `0`
for fetching old version from git history.

```yaml
- uses: actions/checkout@v3
  with:
    fetch-depth: 0
```

## Usage

```yaml
- name: Create version
  uses: cognius/github-actions/.github/actions/create-version@v2
  env:
    APP_VERSION: v1.0.0
    # APP_NAME: test
    # APP_PATHS: |
    #   hello/world
    #   ./local/path
    # VERSION_APP_SEP: /
    # VERSION_PREFIX: v
    # ROOT_WD: /
```

## Environment

### Application version

`APP_VERSION` is a version to create release for (required).
This should be the full-version from `release-info` actions.

### Application name

`APP_NAME` is for filtering version to only specific application (optional).
This only needs when your repository contains multiple application.

### Application path

`APP_PATHS` is for filtering only commit on special path to includes on release notes.

```bash
## Separated by space
APP_PATHS="packages README.md"
## separated by newline
APP_PATHS="integration
e2e
apps/hello"
```

### Version application separator

`VERSION_APP_SEP` is a separator string to
separate application name and version (default is **/**).

### Version prefix

`VERSION_PREFIX` is a prefix before version string (default is **v**).

### Root directory

`ROOT_WD` is a root directory for all relative path to resolve to (default is `$PWD`)

## Development

To testing locally without Github Action.

```bash
DRYRUN=1 APP_VERSION=v1.0.0 \
  ./.github/actions/create-version/create-version.sh
```

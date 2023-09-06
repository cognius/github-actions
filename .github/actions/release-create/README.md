# Create release action

This action using [git-chglog][git-chglog] internally to create git tag and Github Release with release note.

[git-chglog]: https://github.com/git-chglog/git-chglog

## Prerequisite

This action requires **action/checkout** fetch-depth to be `0`
for fetching old version from git history.

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      ## Requires to fetching git history
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Create version
        uses: cognius/github-actions/.github/actions/release-create@v2
        env:
          APP_VERSION: v1.0.0
          # GITHUB_TOKEN: ${{ secrets.CUSTOM_GITHUB_TOKEN }}
```

## Environment

### Application version

`APP_VERSION` is a version to create release for (required).
This should be the full-version from `release-info` actions.

### Github token

`GITHUB_TOKEN` is a custom token to authenticated with GitHub
(default is **secrets.GITHUB_TOKEN**).

## Development

To testing locally without Github Action.

```bash
DRYRUN=1 APP_VERSION=v1.0.0 \
  GITHUB_TOKEN=example GITHUB_REPOSITORY=test/local \
  ./.github/actions/release-create/index.sh
```

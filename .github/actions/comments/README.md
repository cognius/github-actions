# Comments action

Create or Update pull request comments

## Prerequisite

This will only works when [on][github-action-on-url] event is `pull-request`

[github-action-on-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: cognius/github-actions/.github/actions/comments@v2
        env:
          COMMENT_MESSAGE: hello world
          # COMMENT_UPDATE: true
          # GITHUB_TOKEN: ${{ secrets.CUSTOM_GITHUB_TOKEN }}
```

## Environment

### Messages

`COMMENT_MESSAGE` is a as-is comments message to comment on current pull-request.

### Update last message

`COMMENT_UPDATE` set to **true** to update last comment instead of
create new one (default is **false**).

### Github token

Custom token to authenticated with GitHub (default is **secrets.GITHUB_TOKEN**)

## Development

To testing locally without Github Action.

```bash
DRYRUN=true COMMENT_MESSAGE="hello world" \
  GITHUB_TOKEN=example GITHUB_REPOSITORY=test/local \
  GITHUB_EVENT_NAME=pull_request GITHUB_PR_NUMBER=1 \
  ./.github/actions/comments/comments.sh
```

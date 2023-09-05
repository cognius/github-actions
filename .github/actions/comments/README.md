# Comments action

Create or Update pull request comments

## Prerequisite

This will only works when [on][github-action-on-url] event is `pull-request`

[github-action-on-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on

## Usage

```yaml
- name: comment report
  uses: cognius/github-actions/.github/actions/comments@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    COMMENT_MESSAGE: hello world
    # COMMENT_UPDATE: true
```

## Environment

### Messages

`COMMENT_MESSAGE` is a as-is comments message to comment on current pull-request.

### Update last message

`COMMENT_UPDATE` set to **true** to update last comment instead of
create new one (default is **false**).

## Development

To testing locally without Github Action.

```bash
DRYRUN=true COMMENT_MESSAGE="hello world" \
  GITHUB_EVENT_NAME=pull_request GITHUB_PR_NUMBER=1 \
  ./.github/actions/comments/comments.sh
```

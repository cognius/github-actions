# Create version

This action using [git-chglog][git-chglog] internally to create new version with release note.

## Prerequisite

The job which run this command requires action/checkout `fetch-depth: 0` to correctly fetch old version from git history.

```yaml
- uses: actions/checkout@v3
  with:
    fetch-depth: 0
```

Otherwise, you will get error `ERROR  git-tag does not exist` from git-chglog command

[git-chglog]: https://github.com/git-chglog/git-chglog

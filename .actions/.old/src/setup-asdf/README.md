# Set up asdf action

Set up asdf and install tools based on .tool-versions file.

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Set up asdf
        uses: cognius/github-actions/setup-asdf@v2
        with:
            # ref: v0.13.1
            # tool-install: false
            # workdir: /
            # cache-disabled: false
            # cache-key: v1
        env:
            # DRYRUN: true
```

## Inputs

A input values parsed to action using `with` field in **steps** objects.

### Reference

`ref` is a reference of asdf repository (default is **master**).

### Tool install mode

`tool-install` is a boolean flag to install tools listed
on .tool-versions file (default is **false**).

### Work directory

`workdir` is a current working directory,
this also use to resolve .tool-versions file when
you enabled [tool-install](#tool-install-mode) mode (default is **$PWD**).

### Cache disabled

`cache-disabled` is a boolean flag to disabled caching on GitHub Action
(default is **false**).

### Cache key

`cache-key` is a optional key for resolving cache in Github Action.

## Environments

A environment parsed to action using `env` field in **steps** objects.

### Dryrun mode

`DRYRUN` will enabled dry-run mode instead of running actual code.

## Source code

[here](https://github.com/cognius/github-actions/tree/v2/.actions/src/setup-asdf)

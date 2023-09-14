# Set up asdf action

Set up asdf and install tools based on .tool-versions file.

## Get start

<!-- THIS SECTION SHOULD BE REMOVED ONCE YOUR ACTION IS COMPLETED -->

- [ ] Change `name`, `description`, and `author` on **action.yaml** file
- [ ] Add `inputs` and/or `outputs` on **action.yaml** file (if needed)
- [ ] Update README title to `<name> action` where **<name>** is name field in **action.yaml**
- [ ] Update README description to `<description>` where **<description>** is description field in **action.yaml**
- [ ] Update README usage section uses action and add example inputs and/or env key
- [ ] Remove default inputs and environment from README can add your settings

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Typescript Example action
        uses: cognius/github-actions/.github/actions/setup-asdf@v2
        with:
            # ref: v0.13.1
        env:
            # DRYRUN: true
```

## Inputs

A input values parsed to action using `with` field in **steps** objects.

### Example

`example` is a example input.

## Environments

A environment parsed to action using `env` field in **steps** objects.

### Dryrun mode

`DRYRUN` will enabled dry-run mode instead of running actual code.

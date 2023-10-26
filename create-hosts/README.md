# Typescript Example action

Example actions written on Typescript

## Get start

<!-- THIS SECTION SHOULD BE REMOVED ONCE YOUR ACTION IS COMPLETED -->

- [ ] Change `name`, `description`, and `author` on **action.yaml** file
- [ ] Add `inputs` and/or `outputs` on **action.yaml** file (if needed)
- [ ] Update README title to `<name> action` where **<name>** is name field in **action.yaml**
- [ ] Update README description to `<description>` where **<description>** is description field in **action.yaml**
- [ ] Update README usage section uses action and add example inputs and/or env key
- [ ] Remove default inputs and environment from README can add your settings
- [ ] Add actions as module on rspack.config.ts file

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Typescript Example action
        uses: cognius/github-actions/example-ts@v2
        with:
            example: hello world
        env:
            EXAMPLE_TS__DRYRUN: true
```

## Inputs

A input values parsed to action using `with` field in **steps** objects.

### Example

`example` is a example input.

## Environments

A environment parsed to action using `env` field in **steps** objects.

### Dryrun mode

`DRYRUN` will enabled dry-run mode instead of running actual code.

## Source code

[here](https://github.com/cognius/github-actions/tree/v2/.actions/src/example-ts)

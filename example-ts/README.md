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
      - uses: cognius/github-actions/example-ts@v3
        with:
            name: example
        env:
            EXAMPLE_TS__DRYRUN: true
```

## Inputs

A input values parsed to action using `with` field in **steps** objects.

### Name

`name` is a printing name.

## Environments

A environment parsed to action using `env` field in **steps** objects.

### Dryrun mode

`EXAMPLE_TS__DRYRUN` will enabled dry-run mode instead of running actual command.
(alternatively, you can use `DRYRUN` as well).

## Source code

[here](https://github.com/cognius/github-actions/tree/v2/.actions/src/example-ts)

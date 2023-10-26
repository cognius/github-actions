# <name> action

<!-- <description> -->

## Get start

<!-- THIS SECTION SHOULD BE REMOVED ONCE YOUR ACTION IS COMPLETED -->

- [ ] Change `name`, `description`, and `author` on **action.yaml** file
- [ ] Add `inputs` and/or `outputs` on **action.yaml** file (if needed)
- [ ] Update README title to `<name> action` where **<name>** is name field in **action.yaml**
- [ ] Update README description to `<description>` where **<description>** is description field in **action.yaml**
- [ ] Update README usage section uses action and add example inputs and/or env key
- [ ] Update README configurations section from your settings
- [ ] Update README source code section from example-ts to your action name
- [ ] Add actions as module on rspack.config.ts file

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: cognius/github-actions/example-ts@v3
        with:
            # name: example
            # dryrun: true
```

## Configurations

A parsed input send to actions. You have 2 options to configure a value:

1. using [with][steps-with-url] field. (This should be `kebab-case`)
2. using [env][steps-env-url] field. (This should be `UPPER_CASE` and prefix with application name and `__`)
    - Example: `EXAMPLE_TS__NAME`

[steps-with-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith
[steps-env-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsenv

### Name

`name` is a printing name (default is **example**).

| Input | Environment | Alternative Environment |
| ----- | ----------- | ----------------------- |
| name  | NAME        | EXAMPLE_TS__NAME        |

### Dryrun

`dryrun` will enabled dry-run mode instead of running actual command.

| Input  | Environment | Alternative Environment |
| ------ | ----------- | ----------------------- |
| dryrun | DRYRUN      | EXAMPLE_TS__DRYRUN      |

## Source code

> [github-actions-private#action/example-ts][source-code-url]

If you cannot open source code, meaning you don't have permission to open it.

[source-code-url]: https://github.com/cognius/github-actions-private/tree/main/actions/src/example-ts

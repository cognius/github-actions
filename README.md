# Shared Github Actions

> If your project still use v1 (main branch),
> please visited [main-branch](https://github.com/cognius/github-actions/tree/main)

A collection of Shared Github Actions

## Usage

This project provides 2 types of Reusable Github-Action:
**Reusable Actions** and **Reusable Workflows**.

### Reusable actions

> Example: [example-action][example-action-path]
> 
> ref: https://docs.github.com/en/actions/creating-actions/about-custom-actions

To reuse actions:

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      ## <action-name> is a directory name inside /actions directory
      ## <branch-name> should default to 'v2' except if you would like to test your working actions
      ## ref: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-using-a-public-action-in-a-subdirectory
      - uses: cognius/github-actions/.github/actions/<action-name>@<branch-name>
      ## example
      # - uses: cognius/github-actions/.github/actions/example@v2
```

### Reusable workflows

> Example: [example-workflow][example-workflow-path]
> 
> ref: https://docs.github.com/en/actions/using-workflows/reusing-workflows

To reuse workflows:

```yaml
jobs:
  job:
    ## <workflow-name> is a yaml file name inside /workflows directory
    ## <branch-name> should default to 'v2' except if you would like to test your working workflow
    ## ref: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_iduses
    uses: cognius/github-actions/.github/workflows/<workflow-name>.yaml@<branch-name>
    ## example
    # uses: cognius/github-actions/.github/workflows/example.yaml@v2
```

## Actions

List of shared actions on this repository

1. `add-hosts` - add hostname aliases using **/etc/hosts** file ([here][add-hosts-action-path])
2. `example` - example action ([here][example-action-path])

[add-hosts-action-path]: ./actions/add-hosts/README.md
[example-action-path]: ./actions/example/README.md

## Workflows

1. `example` - example workflow ([here][example-workflow-path])

[example-workflow-path]: ./workflows/example/README.md

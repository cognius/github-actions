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

1. `deploy-notify` - notify member on Slack when new deployment occurred ([here][deploy-notify-action-path])
2. `host-aliases` - add hostname aliases using **/etc/hosts** file ([here][host-aliases-action-path])
3. `pr-comment` - add comment to current PR ([here][pr-comment-action-path])
4. `release-create` - create GitHub Release with release notes ([here][release-create-action-path])
5. `release-info` - get release information ([here][release-info-action-path])
6. `example` - example action ([here][example-action-path])

[deploy-notify-action-path]: ./.github/actions/deploy-notify/README.md
[host-aliases-action-path]: ./.github/actions/host-aliases/README.md
[pr-comment-action-path]: ./.github/actions/pr-comment/README.md
[release-create-action-path]: ./.github/actions/release-create/README.md
[release-info-action-path]: ./.github/actions/release-info/README.md
[example-action-path]: ./.github/actions/example/README.md

## Workflows

1. `example` - example workflow ([here][example-workflow-path])

[example-workflow-path]: ./.github/workflows/README.md

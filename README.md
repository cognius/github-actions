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

1. `helm-install` - install/upgrade helm-charts ([here][helm-install-action])
2. `helm-push` - build and push helm-charts package ([here][helm-push-action])
3. `host-aliases` - add hostname aliases using **/etc/hosts** file ([here][host-aliases-action])
4. `pr-comment` - add comment to current PR ([here][pr-comment-action])
5. `release-create` - create GitHub Release with release notes ([here][release-create-action])
6. `release-info` - get release information ([here][release-info-action])
7. `release-notify` - notify member on Slack when new deployment occurred ([here][release-notify-action])
8. `server` - perform action on target server ([here][server-action])
9. `example` - example action ([here][example-action])

[helm-install-action]: ./.github/actions/helm-install/README.md
[helm-install-action]: ./.github/actions/helm-push/README.md
[host-aliases-action]: ./.github/actions/host-aliases/README.md
[pr-comment-action]: ./.github/actions/pr-comment/README.md
[release-create-action]: ./.github/actions/release-create/README.md
[release-info-action]: ./.github/actions/release-info/README.md
[release-notify-action]: ./.github/actions/release-notify/README.md
[server-action]: ./.github/actions/server/README.md
[example-action]: ./.github/actions/example/README.md

## Workflows

1. `example` - example workflow ([here][example-workflow])

[example-workflow]: ./.github/workflows/README.md

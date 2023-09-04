# Release info action

Get release information

## Prerequisite

This action requires **action/checkout** fetch-depth to be `0`
for fetching old version from git history.

```yaml
- uses: actions/checkout@v3
  with:
    fetch-depth: 0
```

## Usage

```yaml
- name: Get information
  uses: cognius/github-actions/.github/actions/release-info@v2
  env:
    # APP_ENV: production
    # APP_NAME: test
    # APP_VERSION: v1.0.0
    # IMAGE_PREFIX: example
    # APP_PATHS: test=packages/test
    # DOCKER_CONTEXT_PATHS: test=
    # DOCKER_FILE_PATHS: test=packages/test/Dockerfile
    # ROOT_WD=/
```

## Environment

### Application environment

`APP_ENV` if set to **production**, version will created; otherwise commit SHA will be use instead.

### Application name

`APP_NAME` is component name (default is **[empty string]**)
(you should define this only if you run on monorepo where your repository contains many application)

### Application version

`APP_VERSION` will override default logic to generate version
and use this as is instead (default is **[empty string]**).

### Docker image prefix

`IMAGE_PREFIX` will docker image prefix, this will use as prefix of `$APP_NAME`.
This can also use as docker image name on single repository.

```bash
## Docker image: test-hello
IMAGE_PREFIX=test- APP_NAME=hello
## Docker image: hello
APP_NAME=hello
## Docker image: custom-name
IMAGE_PREFIX=custom-name
```

### Paths

We provide 3 options for paths resolver. All of them use the same resolve just for different output.
`APP_PATHS`, `DOCKER_CONTEXT_PATHS`, and `DOCKER_FILE_PATHS`;
where `APP_PATHS` will expose as **app-path**, `DOCKER_CONTEXT_PATHS` will expose as **docker-context**,
and `DOCKER_FILE_PATHS` will expose as **docker-file**.

The paths are separated by newline (\n) or spacebar ( )
and use key-value syntax separated by equals sign (**=**) where 
**key** is app name and **value** is relative path from root directory.

```bash
## Use newline (preferable on YAML)
APP_PATHS='appA=packages/a
appB=packages/b'
## Use spacebar
APP_PATHS='appA=packages/a appB=packages/b'
## appA will resolve to root directory
APP_PATHS='appA= appB=packages/b'
```

### Root directory

`ROOT_WD` is a root directory for all relative path to resolve to (default is `$PWD`)

### Version prefix

`VERSION_PREFIX` is a prefix before version string (default is **v**).

### Version separator

`VERSION_SEP` is a separator string to separate version (default is **.**)

### Version application separator

`VERSION_APP_SEP` is a separator string to
separate application name and version (default is **/**).

### Version datetime format

`VERSION_DATETIME_FORMAT` is a `date` format for
generate version (default is **%Y.%-W**)

### Version debug

`VERSION_DEBUG` set to non-empty string to enabled debug logs of **release.sh** script

## Development

```bash
## Minimum environment set; more at [#environment]
./.github/actions/release-info/release.sh

## Minimum environment set; more at [#environment]
GITHUB_ACTION_PATH=$PWD/.github/actions/release-info \
  GITHUB_OUTPUT=/dev/null \
  ./.github/actions/release-info/release-info.sh
```

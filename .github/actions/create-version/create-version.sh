#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_app_version="${APP_VERSION:?}"
_app_name="${APP_NAME:-}"
_app_paths="${APP_PATHS:-}"

## NOTES: Variable from release-info/release.sh
_ver_app_sep="${VERSION_APP_SEP:-/}"
_ver_prefix="${VERSION_PREFIX:-v}"

_token="${GH_TOKEN:-${GITHUB_TOKEN:-${GITHUB_DEFAULT_TOKEN:?}}}"
_repo="${GITHUB_REPOSITORY:?}"

main() {
  if ! command -v gh >/dev/null; then
    printf "[ERR] cannot create comments because Github Cli is missing\n" >&2
    exit 1
  fi

  local args=("release" "create" "$_app_version")
  args+=("--repo" "$_repo")
  args+=("--generate-notes")

  GITHUB_TOKEN="$_token" _exec gh "${args[@]}"
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _app_version _app_name _app_paths
unset _ver_app_sep _ver_prefix
unset _token _repo

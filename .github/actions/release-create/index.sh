#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_app_version="${APP_VERSION:?}"

_token="${GH_TOKEN:-${GITHUB_TOKEN:-${GITHUB_DEFAULT_TOKEN:?}}}"
_repo="${GITHUB_REPOSITORY:?}"

main() {
  if ! command -v gh >/dev/null; then
    printf "[ERR] cannot create comments because Github Cli is missing\n" >&2
    exit 1
  fi
  if [[ "$_app_version" =~ ^sha- ]]; then
    printf "[INF] skipped create development version (%s)" "$_app_version" >&2
    return 0
  fi

  local formatted_date
  formatted_date="$(date +"%Y-%m-%d")"
  local args=("release" "create" "$_app_version")
  args+=("--repo" "$_repo")
  args+=("--generate-notes")
  args+=("--title" "$_app_version ($formatted_date)")

  local last_version
  last_version="$(_last_version)"
  if test -n "$last_version"; then
    args+=("--notes-start-tag" "$last_version")
  fi

  GITHUB_TOKEN="$_token" _exec gh "${args[@]}"
}

_last_version() {
  local prefix
  prefix="$(echo "$_app_version" | grep -oE '^[^0-9]*' | head -n1)"
  local head
  head="$(git rev-list --tags --max-count=1)"
  if ! git describe \
    --abbrev=0 --match "$prefix*" --tags "$head" 2>/dev/null; then
    printf ''
  fi
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _app_version
unset _token _repo

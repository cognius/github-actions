#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_message="${COMMENT_MESSAGE:?}"
_update="${COMMENT_UPDATE:-false}"

## Set internally by action.yaml
_pr="${GITHUB_PR_NUMBER:?}"

main() {
  if ! command -v gh >/dev/null; then
    printf "[ERR] cannot create comments because Github Cli is missing" >&2
    exit 1
  fi

  local tmp
  tmp="$(mktemp)"

  printf "%s" "$_message" >"$tmp"

  local args=("pr" "comment" "$_pr")
  args+=("--body-file" "$tmp")
  if test -n "$_update" && [[ "$_update" != "false" ]]; then
    args+=("--edit-last")
  fi

  _exec gh "${args[@]}"
}

_exec() {
  local cmd="$1"
  shift

  printf "$ %s %s\n" "$cmd" "$*"
  if test -z "$DRYRUN"; then
    "$cmd" "$@"
  fi
}

main

unset _message _update _pr

#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_repos="${REPOSITORIES:-}"

main() {
  if ! command -v helm >/dev/null; then
    printf "[ERR] 'helm' command is required" >&2
    exit 1
  fi
  if test -z "$_repos"; then
    _warn "no repositories found, skipped"
    return 0
  fi

  # shellcheck disable=SC2206
  local repo=($_repos) raw name url
  for raw in "${repo[@]}"; do
    if test -n "$raw"; then
      name="${raw%%=*}"
      url="${raw##*=}"

      if [[ "$name" == "$url" ]] || test -z "$name" || test -z "$url"; then
        _warn "invalid repository syntax (%s)" "$raw"
        continue
      fi

      _exec helm repo add "$name" "$url"
    fi
  done
}

_warn() {
  local format="$1"
  shift
  # shellcheck disable=SC2059
  printf "[WRN] $format\n" "$@" >&2
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _repos

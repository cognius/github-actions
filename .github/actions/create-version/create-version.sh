#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_app_version="${APP_VERSION:?}"
_app_name="${APP_NAME:-}"
_app_paths="${APP_PATHS:-}"
_token="${GH_TOKEN:-${GITHUB_TOKEN:-${GITHUB_DEFAULT_TOKEN:?}}}"

## NOTES: Variable from release-info/release.sh
_ver_app_sep="${VERSION_APP_SEP:-/}"
_ver_prefix="${VERSION_PREFIX:-v}"
## Set by bash
_root_path="${ROOT_WD:-$PWD}"

main() {
  ## Create git tag on local
  _exec git tag "$_app_version"

  ## Create release notes
  local release_notes
  if command -v git-chglog >/dev/null; then
    local tmp chglog_args=()
    tmp="$(mktemp)"
    release_notes="$(mktemp)"

    if test -n "$_app_paths"; then
      # shellcheck disable=SC2206
      local paths=($_app_paths) fullpath path
      for path in "${paths[@]}"; do
        fullpath="$_root_path/$path"
        if test -d "$fullpath" || test -f "$fullpath"; then
          chglog_args+=(--path "$fullpath")
        else
          _warn "no such path at '%s'" "$fullpath"
        fi
      done
    fi
    if test -n "$_app_name"; then
      chglog_args+=(--tag-filter-pattern "^$_app_name$_ver_app_sep$_ver_prefix")
    fi

    chglog_args+=(--output "$tmp")
    chglog_args+=("$_app_version")

    _exec git-chglog "${chglog_args[@]}" &&
      echo "$_app_version" >"$release_notes" &&
      echo "" >>"$release_notes" &&
      tail -n +3 "$tmp" >>"$release_notes"
  else
    _warn "skipped release notes because git-chglog command not found"
  fi

  ## Upload git tag to Github Release
  if command -v hub >/dev/null; then
    local hub_args=("release" "create")
    if test -n "$release_notes" && test -f "$release_notes"; then
      hub_args+=("--file" "$release_notes")
    fi

    hub_args+=("$_app_version")
    GITHUB_TOKEN="$_token" _exec hub "${hub_args[@]}"
  else
    _warn "skipped create release because hub command not found"
  fi
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

_warn() {
  local format="$1"
  shift

  # shellcheck disable=SC2059
  printf "[WRN] $format\n" "$@" >&2
}

main

unset _app_version _app_name _app_paths _token
unset _ver_app_sep _ver_prefix
unset _root_path

#!/usr/bin/env bash

_git_tag="${GIT_TAG:-${TAG_NAME:?}}"
_app_name="${APP_NAME:-$COMPONENT}"
_app_path="${APP_PATH:-}"

__note="/tmp/RELEASE_NOTE.md"

_exec() {
  printf "$ %s\n" "$*"
  "$@"
}

## Create git tag on local
_exec git tag "$_git_tag"

## Generate release note
if command -v git-chglog >/dev/null; then
  __tmp="/tmp/__RELEASE_NOTE.md"
  __chglog_args=()

  test -n "$_app_path" &&
    __chglog_args+=(--path "$_app_path")
  test -n "$_app_name" &&
    __chglog_args+=(--tag-filter-pattern "^$_app_name/v")
  __chglog_args+=(--output "$__tmp")
  __chglog_args+=("$_git_tag")

  _exec git-chglog "${__chglog_args[@]}"
  echo "$_git_tag" >"$__note"
  echo "" >>"$__note"
  tail -n +3 "$__tmp" >>"$__note"

  unset __tmp
  unset __chglog_args
fi

## Upload git tag to Github Release
if command -v hub >/dev/null; then
  _exec hub release create --file "$__note" "$_git_tag"
fi

unset _git_tag _app_name _app_path
unset __note

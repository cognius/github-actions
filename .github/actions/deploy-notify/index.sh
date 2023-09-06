#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_type="${NOTIFY_TYPE:?}"

_disabled="${NOTIFY_DISABLED:-false}"
_action="${NOTIFY_ACTION:-deploy}"
_step="${NOTIFY_STEP:-}"

_app_name="${APP_NAME:?}"
_app_version="${APP_VERSION:-}"
_app_env="${APP_ENV:-}"

_webhook="${SLACK_WEBHOOK:?}"

## Auto-assign by GitHub Action
_git_repo="${GITHUB_REPOSITORY:?}"
_git_ref_type="${GITHUB_REF_TYPE:?}"
_git_ref="${GITHUB_REF_NAME:?}"
_git_author="${GITHUB_ACTOR:?}"
_git_commit="${GITHUB_SHA:?}"
_gh_id="${GITHUB_RUN_ID:?}"

main() {
  local ref_url="https://github.com/$_git_repo/tree/$_git_ref"
  [[ "$_git_ref_type" == "tag" ]] &&
    ref_url="https://github.com/$_git_repo/releases/tag/$_git_ref"
  local ref_md="<$ref_url|$_git_ref>"

  local commit_url="https://github.com/$_git_repo/commit/$_git_commit"
  local commit_md="<$commit_url|${_git_commit:0:7}>"

  local action_url="https://github.com/$_git_repo/actions/runs/$_gh_id"
  local action_md="<$action_url|$_gh_id>"

  local version="$_app_version"
  test -z "$version" && [[ "$_git_ref_type" == "tag" ]] &&
    version="$_git_ref"

  local args=(
    $'\n'
    "$version"
    "$commit_md" "$ref_md" "$action_md"
  )

  case "$_type" in
  starting | start | t) _send _start_message "${args[@]}" ;;
  failure | error | fail | f) _send _error_message "${args[@]}" ;;
  successful | success | s) _send _success_message "${args[@]}" ;;
  completed | complete | p) _send _complete_message "${args[@]}" ;;
  cancelled | cancel | c) _send _cancel_message "${args[@]}" ;;
  *) _send_invalid_message ;;
  esac

  ## send notification shouldn't failed workflow
  return 0
}

_start_message() {
  local newline="$1" version="$2"
  local commit_md="$3" ref_md="$4" action_md="$5"
  local message=()

  if [[ "$_app_env" == "production" ]]; then
    [[ "$_git_ref_type" == "branch" ]] &&
      [[ "$_git_ref_type" != "main" ]] &&
      message+=("<!here>")
  fi

  message+=("*$_git_author*" "starting" "$_action")
  test -n "$version" &&
    message+=("\`${_app_name}[${version}]\`")
  test -z "$version" &&
    message+=("\`${_app_name}\`")
  message+=("from $commit_md")
  test -n "$_app_env" &&
    message+=("to *$_app_env*")
  message+=("(${action_md})")

  printf "%s" "${message[*]}"
}

_error_message() {
  local newline="$1" version="$2"
  local commit_md="$3" ref_md="$4" action_md="$5"
  local message=()

  message+=("<!here>")
  message+=("Finished *$_action*")
  test -n "$_step" && message+=("with \`error\` at *$_step* step,")
  test -z "$_step" && message+=("with \`error\`,")
  message+=("please check $action_md")

  printf "%s" "${message[*]}"
}

_success_message() {
  local newline="$1" version="$2"
  local commit_md="$3" ref_md="$4" action_md="$5"
  local message=()

  message+=("Finished *$_action* successfully ($action_md)" "$newline")
  message+=("- *Application name*: $_app_name" "$newline")
  test -n "$_app_env" &&
    message+=("- *Environment*: $_app_env" "$newline")
  test -n "$version" &&
    message+=("- *Application version*: \`$version\`" "$newline")
  message+=("- *Author*: $_git_author" "$newline")
  message+=("- *Commit*: $commit_md" "$newline")
  message+=("- *Reference*: $ref_md" "$newline")

  printf "%s" "${message[*]}"
}

_cancel_message() {
  local newline="$1" version="$2"
  local commit_md="$3" ref_md="$4" action_md="$5"
  local message=()

  message+=("<!here>")
  message+=("*$_git_author*" "$_type" "$_action")
  message+=("(${action_md})")

  printf "%s" "${message[*]}"
}

_complete_message() {
  local newline="$1" version="$2"
  local commit_md="$3" ref_md="$4" action_md="$5"
  local message=()

  message+=("Completed *$_action* ($action_md)" "$newline")
  message+=("- *Application name*: $_app_name" "$newline")
  test -n "$_app_env" &&
    message+=("- *Environment*: $_app_env" "$newline")
  test -n "$version" &&
    message+=("- *Application version*: \`$version\`" "$newline")
  message+=("- *Author*: $_git_author" "$newline")
  message+=("- *Commit*: $commit_md" "$newline")
  message+=("- *Reference*: $ref_md" "$newline")

  printf "%s" "${message[*]}"
}

_send_invalid_message() {
  printf "[WRN] Invalid message status (%s)\n" "$_type" >&2
}

_send() {
  if test -n "$_disabled" && [[ "$_disabled" != "false" ]]; then
    printf "[INFO] notification is disabled"
    return 0
  fi

  local callback="$1"
  shift

  local message
  message="$("$callback" "$@")"

  printf "[INFO] preparing message\n\`\`\`\n%s\n\`\`\`\n\n" "$message"
  if test -n "$message"; then
    printf "[INFO] sending notification\n"
    _exec curl \
      --silent --show-error --location \
      --request POST --header 'Content-type: application/json' \
      --data "{\"text\":\"$message\"}" \
      "$_webhook"
  fi
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _type _disabled _action _step
unset _app_name _app_version _app_env
unset _webhook
unset _git_repo _git_ref_type _git_ref
unset _git_author _git_commit _gh_id

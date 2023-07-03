#!/usr/bin/env bash

_mode="${NOTIFY_MODE:-${RELEASE_MODE:?}}"
_status="${NOTIFY_STATUS:-${NOTIFY_TYPE:?}}"
_step="${NOTIFY_STEP:-}"

_app_name="${APP_NAME:-${COMPONENT:?}}"
_app_version="${APP_VERSION:-${RELEASE_VERSION:-}}"
_environment="${ENVIRONMENT:-}"

_webhook="${SLACK_WEBHOOK:?}"

## Auto-assign by GitHub Action
_git_repo="${GIT_REPO:?}"
_git_ref="${GIT_REF:?}"
_git_author="${GIT_AUTHOR:?}"
_git_commit="${GIT_COMMIT:?}"
_gh_id="${GITHUB_ACTION_ID:?}"

main() {
  local commit_url="https://github.com/$_git_repo/commit/$_git_commit"
  local commit_md="<$commit_url|$_git_ref>"

  local action_url="https://github.com/$_git_repo/actions/runs/$_gh_id"
  local action_md="<$action_url|$_gh_id>"

  local args=($'\n' "$commit_md" "$action_md")
  case "$_status" in
  start | starting) send __start_message "${args[@]}" ;;
  error | fail | failure) send __error_message "${args[@]}" ;;
  success) send __success_message "${args[@]}" ;;
  esac

  ## Never failed to send notification
  return 0
}

__start_message() {
  local newline="$1" commit="$2" action="$3"
  local message=()

  [[ "$_environment" == "production" ]] && [[ "$_git_ref" != "main" ]] &&
    message+=("<!here>")
  message+=("*$_git_author*" "starting" "$_mode")
  test -n "$_app_version" &&
    message+=("\`${_app_name}[${_app_version}]\`")
  test -z "$_app_version" &&
    message+=("\`${_app_name}\`")
  message+=("from $commit")
  test -n "$_environment" && message+=("to *$_environment*")
  message+=("(${action})")

  printf "%s" "${message[*]}"
}

__error_message() {
  local newline="$1" commit="$2" action="$3"
  local message=()

  message+=("<!here>")
  message+=("Finished *${_mode}*")
  test -n "$_step" && message+=("with \`error\` at *$_step* step,")
  test -z "$_step" && message+=("with \`error\`,")
  message+=("please check $action")

  printf "%s" "${message[*]}"
}

__success_message() {
  local newline="$1" commit="$2" action="$3"
  local message=()

  message+=("Finished *$_mode* successfully $action" "$newline")
  message+=("- *Application name*: $_app_name" "$newline")
  test -n "$_environment" &&
    message+=("- *Environment*: $_environment" "$newline")
  test -n "$_app_version" &&
    message+=("- *Application version*: \`$_app_version\`" "$newline")
  message+=("- *Reference*: $commit" "$newline")

  printf "%s" "${message[*]}"
}

send() {
  local enabled="${NOTIFY_ENABLED:-true}" msg_fn="$1"
  shift

  local message
  message="$("$msg_fn" "$@")"

  printf "[INFO] preparing message\n\`\`\`\n%s\n\`\`\`\n\n" "$message"
  if [[ "$enabled" == true ]]; then
    if test -n "$message"; then
      printf "[INFO] sending notification\n"
      curl \
        --silent --show-error --location \
        --request POST --header 'Content-type: application/json' \
        --data "{\"text\":\"$message\"}" \
        "$_webhook"
    fi
  else
    echo "[INFO] stopped notification (\$NOTIFY_ENABLED set to false)"
    return 0
  fi
}

main || echo "[ERROR] Something went wrong"

unset _mode _step _status
unset _app_name _app_version _environment
unset _webhook
unset _git_repo _git_ref _git_author _git_commit _gh_id

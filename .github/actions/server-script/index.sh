#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_server="${SERVER_TARGET:?}"
_user="${SERVER_USERNAME:?}"
_private_key_base64="${SERVER_PRIVATE_KEY_BASE64:?}"
_start_script="${SERVER_SCRIPT:-}"
_start_file="${SERVER_FILE:-}"

_connection_string="${_user}@${_server}"

main() {
  if test -z "$_start_file" && test -z "$_start_script"; then
    printf "Either start script or start file must provides" >&2
    exit 1
  fi

  local private_key="${TEMP_PRIVATE_KEY:?}"
  echo "$_private_key_base64" | base64 -d >"$private_key"

  local script name
  script="$(mktemp)"
  name="$(basename "$script")"

  if test -n "$_start_script"; then
    printf '%s' "$_start_script" >"$script"
  elif test -n "$_start_file"; then
    rm "$script"
    mv "$_start_file" "$script"
  fi

  _scp "$private_key" "$name" "$script"
  _ssh "$private_key" "$name"
}

_scp() {
  local private_key="$1" name="$2" script="$3"
  _exec scp -i "$private_key" "$script" "$_connection_string:/tmp/$name"
}

_ssh() {
  local private_key="$1" name="$2"
  _exec ssh -i "$private_key" -t "bash /tmp/$name" "$_connection_string"
}

_exec() {
  local cmd="$1" args=()
  shift

  test -n "$DEBUG" && args+=("-v")
  args+=("$@")

  printf '$ %s %s\n' "$cmd" "${args[*]}"
  if test -z "$DRYRUN"; then
    "$cmd" "${args[@]}"
  fi
}

main

unset _server _user _private_key_base64
unset _start_script _start_file
unset _connection_string

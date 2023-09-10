#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_action="${SERVER_ACTION:-connect}"

_server="${SERVER_TARGET:?}"
_user="${SERVER_USERNAME:?}"
_private_key_base64="${SERVER_PRIVATE_KEY_BASE64:?}"
_fingerprint="${SERVER_PUBLIC_FINGERPRINT:?}"

_private_key="${TEMP_PRIVATE_KEY:?}"
_connection_string="${_user}@${_server}"

main() {
  _create_private_key
  _create_known_hosts

  case "$_action" in
  connection | connect | c) _server_connect ;;
  copy | p) _server_copy ;;
  esac
}

_create_private_key() {
  echo "$_private_key_base64" | base64 -d >"$_private_key"
}
_create_known_hosts() {
  if test -n "$DRYRUN"; then
    printf 'append "%s %s" to known_hosts\n' "$_server" "$_fingerprint"
  else
    test -d "$HOME/.ssh" || mkdir "$HOME/.ssh"
    echo "$_server $_fingerprint" >>"$HOME/.ssh/known_hosts"
  fi
}

_server_connect() {
  local script="${SERVER_CONNECT_SCRIPT:?}"
  _exec ssh -i "$_private_key" -t "$script" "$_connection_string"
}

_server_copy() {
  local base="${SERVER_COPY_BASE:?}" target="${SERVER_COPY_DEST:-}"
  _exec scp -i "$_private_key" "$base" "$_connection_string:$target"
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

unset _action
unset _server _user _private_key_base64 _fingerprint
unset _private_key _connection_string

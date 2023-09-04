#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_app_env="${APP_ENV:-}"
_app_name="${APP_NAME:-}"
_app_version="${APP_VERSION:-}"

_image_prefix="${IMAGE_PREFIX:-}"

## Paths syntax is `<name>=<path>` and separated by newline
_app_paths="${APP_PATHS:-}"
_docker_context_paths="${DOCKER_CONTEXT_PATHS:-}"
_docker_file_paths="${DOCKER_FILE_PATHS:-}"

## Set by Github Action
_action_path="${GITHUB_ACTION_PATH:?}"
## Set by bash
_root_path="${ROOT_WD:-$PWD}"

######################################

main() {
  _set_output "mode" "$(_run_release mode)"
  _set_output "environment" "$_app_env"
  _set_output "app-name" "$_app_name"
  _set_output_path "app-path" "$(_find_path "$_app_paths")"
  _set_output "app-version" "$(_run_release version)"
  _set_output "git-tag" "$(_run_release full-version)"

  _set_output "docker-image" "$_image_prefix$_app_name"
  _set_output_path "docker-context" "$(_find_path "$_docker_context_paths")"
  _set_output_path "docker-file" "$(_find_path "$_docker_file_paths")"
}

_run_release() {
  local release="$_action_path/release.sh"
  local input="$1" tag="$_app_version"
  if test -z "$tag" && [[ "$_app_env" != "production" ]]; then
    tag="sha-$(git rev-parse --short HEAD)"
  fi
  "$release" "$input" "$_app_name" "$tag"
}

_find_path() {
  local paths="$1" path=''
  local name="$_app_name"
  ## If no custom paths; return name as subdirectory
  if test -z "$path" && test -n "$name" && test -z "$paths"; then
    path="$_root_path/$name"
  fi

  ## If custom paths found; find from custom paths
  if test -z "$path" && test -n "$name" && test -n "$paths"; then
    # shellcheck disable=SC2206
    local path_array=($paths)
    local raw key value
    for raw in "${path_array[@]}"; do
      key="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$key" == "$name" ]]; then
        path="$_root_path/$value"
        break
      fi
    done
  fi

  if test -z "$path"; then
    path="$_root_path"
  fi
  printf '%s' "$path"
}

_set_output() {
  local key="$1" value="$2"

  printf "[%-10s] %-20s : '%s'\n" "info" "$key" "$value"
  echo "$key=$value" >>"${GITHUB_OUTPUT:?}"
}
_set_output_path() {
  local key="$1" path="$2"
  if test -n "$path" && test -f "$path" || test -d "$path"; then
    _set_output "$key" "$path"
  else
    printf "no such file/folder at '%s' (%s)" "$path" "$key" >&2
    return 1
  fi
}

######################################

main

unset _app_env _app_name _app_version
unset _image_prefix
unset _app_paths _docker_file_paths _docker_context_paths
unset _action_path _root_path

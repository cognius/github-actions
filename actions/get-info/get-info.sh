#!/usr/bin/env bash

_environment="${ENVIRONMENT:?}"
_app_name="${APP_NAME:-${COMPONENT:?}}"

_image_prefix="${IMAGE_PREFIX:-}"
_image_tag="${IMAGE_TAG:-$OVERRIDE_TAG}"

# All paths are configs as `<key>=<value>` and separated by newline
_app_paths="${APP_PATHS:-$COMPONENTS_PATH}"
_df_paths="${DOCKERFILE_PATHS:-$DOCKERFILES_PATH}"
_context_paths="${CONTEXT_PATHS:-$CONTEXTS_PATH}"

## Set by Github Action
_action_path="${GITHUB_ACTION_PATH:?}"
## Set by bash
_root_path="${ROOT_WD:-$PWD}"

######################################

main() {
  _set_output "app-name" "$_app_name"
  _set_output "app-path" "$(get_app_path)"
  _set_output "environment" "$_environment"
  _set_output "version" "$(get_releaser version)"
  _set_output "git-tag" "$(get_releaser full-version)"
  _set_output "mode" "$(get_releaser mode)"

  _set_output "docker-image" "$(get_docker_image)"
  _set_output "docker-context" "$(get_docker_context)"
  _set_output "docker-file" "$(get_docker_file)"
}

get_app_path() {
  local name value raw repo
  local path="$_app_name"
  if test -n "$_app_paths"; then
    # shellcheck disable=SC2206
    repo=($_app_paths)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$_app_name" ]]; then
        path="$value"
        break
      fi
    done
  fi
  if test -n "$path"; then
    printf "%s/%s" "$_root_path" "$path"
  else
    printf "%s" "$_root_path"
  fi
}

get_releaser() {
  local releaser="$_action_path/get-release.sh"
  local input="$1" tag="$_image_tag"
  if test -z "$tag" && [[ "$_environment" != "production" ]]; then
    tag="sha-$(git rev-parse --short HEAD)"
  fi
  "$releaser" "$input" "$_app_name" "$tag"
}

get_docker_image() {
  printf "%s%s" "$_image_prefix" "$_app_name"
}

get_docker_context() {
  local name value raw repo
  local path=""
  if test -n "$_context_paths"; then
    # shellcheck disable=SC2206
    repo=($_context_paths)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$_app_name" ]]; then
        path="$value"
        break
      fi
    done
  fi

  if test -n "$path"; then
    printf "%s/%s" "$_root_path" "$path"
  else
    printf "%s" "$_root_path"
  fi
}

get_docker_file() {
  local name value raw
  local path="Dockerfile"
  if test -n "$_df_paths"; then
    # shellcheck disable=SC2206
    repo=($_df_paths)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$_app_name" ]]; then
        path="$value"
        break
      fi
    done
  fi

  printf "%s/%s" "$(get_app_path)" "$path"
}

_set_output() {
  local key="$1" value="$2"

  printf "%-20s : '%s'\n" "$key" "$value"
  echo "$key=$value" >>"${GITHUB_OUTPUT:?}"
}

main

unset _environment
unset _app_name
unset _image_prefix _image_tag
unset _df_paths _app_paths _context_paths
unset _action_path _root_path

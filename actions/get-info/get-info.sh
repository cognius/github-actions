#!/usr/bin/env bash

component="${COMPONENT:?}"
components_path="${COMPONENTS_PATH:-}"
env="${ENVIRONMENT:?}"
override_tag="${OVERRIDE_TAG:-}"

contexts_path="${CONTEXTS_PATH:-}"
image_prefix="${IMAGE_PREFIX:-}"

dockerfiles_path="${DOCKERFILES_PATH:-}"

## Set by Github Action
action_path="${GITHUB_ACTION_PATH:?}"
## Set by bash
root_path="${ROOT_WD:-$PWD}"

######################################

main() {
  _set_output "app-path" "$(get_app_path)"
  _set_output "version" "$(get_releaser version)"
  _set_output "git-tag" "$(get_releaser full-version)"
  _set_output "mode" "$(get_releaser mode)"

  _set_output "docker-image" "$(get_docker_image)"
  _set_output "docker-context" "$(get_docker_context)"
  _set_output "docker-file" "$(get_docker_file)"
}

get_app_path() {
  local name value raw
  local path="$component"
  if test -n "$components_path"; then
    # shellcheck disable=SC2206
    repo=($components_path)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$component" ]]; then
        path="$value"
        break
      fi
    done
  fi

  printf "%s/%s" "$root_path" "$path"
}

get_releaser() {
  local releaser="$action_path/get-release.sh"
  local input="$1" tag="$override_tag"
  if test -z "$tag" &&
    [[ "$env" != "production" ]]; then
    tag="sha-$(git rev-parse --short HEAD)"
  fi

  $releaser "$input" "$component" "$tag"
}

get_docker_image() {
  if test -n "$image_prefix"; then
    printf "%s%s" "$image_prefix" "$component"
  else
    printf "%s" "$component"
  fi
}

get_docker_context() {
  local name value raw
  local path=""
  if test -n "$contexts_path"; then
    # shellcheck disable=SC2206
    repo=($contexts_path)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$component" ]]; then
        path="$value"
        break
      fi
    done
  fi

  if test -n "$path"; then
    printf "%s/%s" "$root_path" "$path"
  else
    printf "%s" "$root_path"
  fi
}

get_docker_file() {
  local name value raw
  local path="Dockerfile"
  if test -n "$dockerfiles_path"; then
    # shellcheck disable=SC2206
    repo=($dockerfiles_path)
    for raw in "${repo[@]}"; do
      name="${raw%%=*}"
      value="${raw##*=}"
      if [[ "$name" == "$component" ]]; then
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

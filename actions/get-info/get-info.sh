#!/usr/bin/env bash

component="${COMPONENT:?}"
env="${ENVIRONMENT:?}"
override_tag="${OVERRIDE_TAG:-}"
image_prefix="${IMAGE_PREFIX:-}"

## Set by Github Action
action_path="${GITHUB_ACTION_PATH:?}"
## Set by bash
root_path="$PWD"

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
  local path=""
  case "$component" in
  "gst") path="golang/app/sumato-gst" ;;
  "refresher" | "updater")
    path="golang/app/$component"
    ;;
  "db-deployment")
    path="db-deployment"
    ;;
  *)
    path="java/$component"
    ;;
  esac

  printf "%s/%s" "$root_path" "$path"
}

get_releaser() {
  local releaser="$action_path/get-release.sh"
  local input="$1" tag="$override_tag"
  if test -z "$tag" &&
    [[ "$env" != "production" ]]; then
    tag="$(git rev-parse --short HEAD)"
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
  local context="$root_path"
  case "$component" in
  "db-deployment")
    context="$root_path/db-deployment"
    ;;
  esac
  printf "%s" "$context"
}

get_docker_file() {
  local app_path
  app_path="$(get_app_path)"

  local filename="Dockerfile"
  case "$component" in
  "db-deployment")
    filename="Dockerfile-sumatodb"
    ;;
  esac

  printf "%s/%s" "$app_path" "$filename"
}

_set_output() {
  local key="$1" value="$2"

  printf "%-20s : '%s'\n" "$key" "$value"
  echo "$key=$value" >>"${GITHUB_OUTPUT:?}"
}

main

#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_app_env="${APP_ENV:?}"
_app_name="${APP_NAME:?}"
_app_version="${APP_VERSION:-}"

_helm_debug="${HELM_DEBUG:-false}"
_helm_force="${HELM_FORCE:-false}"
_helm_recreate="${HELM_RECREATE:-false}"
_helm_timeout="${HELM_TIMEOUT:-5m}"
## use when user provides `$APP_VERSION` to override image tags
_helm_image_tag_key="${HELM_IMAGE_TAG_KEY:-image.tag}"
## Version of deploying helm-charts
_helm_chart_version="${HELM_CHART_VERSION:-}"
_helm_uninstall_args="${HELM_UNINSTALL_ARGUMENTS:-}"
_helm_upgrade_args="${HELM_UPGRADE_ARGUMENTS:-}"

_aws_account="${AWS_ACCOUNT_ID:?}"
_aws_region="${AWS_REGION:?}"
_aws_eks_cluster="${AWS_EKS_CLUSTER_NAME:?}"
_aws_ecr_registry="${AWS_ECR_REGISTRY:-$_aws_account.dkr.ecr.$_aws_region.amazonaws.com}"

_deploy_dir="${DEPLOY_DIR:-deploys}"
_config_file="${DEPLOY_CONFIG_FILE:-config.json}"
_root_path="${ROOT_PATH:-$PWD}"

_app_path="${APP_PATH:-$_root_path/$_deploy_dir/$_app_name}"
_conf_path="${CONFIG_PATH:-$_app_path/$_config_file}"

if test -z "$AWS_ECR_REGISTRY"; then
  export AWS_ECR_REGISTRY="$_aws_ecr_registry"
fi

main() {
  if ! command -v jq >/dev/null; then
    _error "command '%s' is missing" jq
  fi

  if ! test -d "$_app_path"; then
    _error "'%s' directory is missing (%s)" "$_deploy_dir" "$_app_path"
  fi
  if ! test -f "$_conf_path"; then
    _error "config file (%s) is missing (%s)" "$_config_file" "$_conf_path"
  fi

  _eks_login
  _helm_install
}

_eks_login() {
  local args=("eks" "update-kubeconfig")
  args+=(--name "$_aws_eks_cluster")
  args+=(--region "$_aws_region")

  _exec aws "${args[@]}"
}

_helm_install() {
  local schema chart_url chart chart_version release_name namespace values
  schema="$(_config_get ".schema" "oci")"
  chart_url="$(_config_get ".chart")"
  chart="$(__build_chart "$schema" "$chart_url")"

  chart_version="$(_config_get ".chartVersion" "latest")"
  test -n "$_helm_chart_version" && chart_version="$_helm_chart_version"

  release_name="$(_config_get ".name")"

  local env_query=".environments.$_app_env"
  release_name="$(_config_get "$env_query.name" "$release_name")"
  namespace="$(_config_get "$env_query.namespace")"
  values="$(_config_get "$env_query.values")"

  values="$(__build_values "$values")"

  if test -z "$chart" ||
    test -z "$chart_version" ||
    test -z "$release_name" ||
    test -z "$namespace" ||
    test -z "$values"; then
    _error "missing requires fields"
  fi
  if ! test -f "$values"; then
    _error "helm-chart values is missing (%s)" "$values"
  fi

  if __is_enabled "$_helm_recreate"; then
    _helm_uninstall "$namespace" "$release_name"
  fi

  local args=()

  args+=(upgrade --install)
  args+=(--wait --atomic --timeout "$_helm_timeout")
  args+=(--namespace "$namespace")
  args+=(--values "$values")
  [[ "$chart_version" != "latest" ]] &&
    args+=(--version "$chart_version")
  test -n "$_app_version" &&
    args+=(--set "${_helm_image_tag_key}=${_app_version}")

  __is_enabled "$_helm_force" && args+=(--force)
  __is_enabled "$_helm_debug" && args+=(--debug)

  args+=("$release_name" "$chart")

  # shellcheck disable=SC2206
  test -n "$_helm_upgrade_args" && args+=($_helm_upgrade_args)

  _exec helm "${args[@]}"
}

_helm_uninstall() {
  local ns="$1" release="$2"

  local args=(uninstall "$release")
  args+=("--namespace" "$ns")
  args+=("--wait" "--timeout" "$_helm_timeout")
  test -n "$_helm_debug" && args+=("--debug")

  # shellcheck disable=SC2206
  test -n "$_helm_uninstall_args" && args+=($_helm_uninstall_args)

  __exec helm "${args[@]}"
}

_config_get() {
  local query="$1" default_value="$2"
  local value
  value="$(jq --monochrome-output --raw-output "$query" "$_conf_path")"

  if [[ "$value" == "null" ]]; then
    if ! test -n "$default_value"; then
      _error "json query '%s' return <null>" "$query"
    else
      __parse_template "$default_value"
    fi
  else
    __parse_template "$value"
  fi
}

__build_chart() {
  local schema="$1" url="$2"
  case "$schema" in
  oci) printf "%s://%s" "$schema" "$url" ;;
  esac
}
__build_values() {
  local values="$1"
  local values_path="$_app_path/$values"
  if [[ "$values" =~ \.tpl$ ]]; then
    local new_path
    new_path="$(mktemp -d)/values.yaml"
    __parse_template "$(cat "$values_path")" >"$new_path"
    values_path="$new_path"
  fi

  printf '%s' "$values_path"
}

__parse_template() {
  local input="$1" code=0
  eval "printf '%s' \"$input\""
  code=$?

  if [ "$code" -gt 0 ]; then
    _error "Parsing value (%s) failed" "$input"
  fi
}
__is_enabled() {
  test -n "$1" && [[ "$1" != "false" ]]
}

_warn() {
  local format="$1"
  shift
  # shellcheck disable=SC2059
  printf "[WRN] $format\n" "$@" >&2
}
_error() {
  local format="$1"
  shift
  # shellcheck disable=SC2059
  printf "[ERR] $format\n" "$@" >&2
  exit 1
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _app_name _app_version _app_env
unset _helm_debug _helm_force _helm_recreate _helm_timeout
unset _helm_image_tag_key _helm_chart_version
unset _helm_uninstall_args _helm_upgrade_args
unset _aws_account _aws_region _aws_eks_cluster _aws_ecr_registry
unset _deploy_dir _config_file _root_path _app_path _conf_path

#!/usr/bin/env bash

set -e

HELM_CMD="helm"
AWS_CMD="aws"
DEPLOY_DIR="deploys"
CONFIG_FILE="config.json"
VALUES_FILE="values.yaml"

_DRYRUN="${DRYRUN:-}"
_DEBUG="${DEBUG:-}"
_RECREATE="${RECREATE:-}"
_FORCE="${FORCE:-}"

_WORKDIR="${WORKDIR:-$PWD}"
_CHART_VERSION="${CHART_VERSION:-}"
_AWS_REGION="${AWS_REGION:?}"
_AWS_ECR_REGISTRY="${AWS_ECR_REGISTRY:?}"
_APP_NAME="${APP_NAME:?}"
_APP_VERSION="${APP_VERSION:-}"
_ENVIRONMENT="${ENVIRONMENT:?}"
_EKS_CLUSTER_NAME="${EKS_CLUSTER_NAME:?}"
_HELM_TIMEOUT="${HELM_TIMEOUT:-5m}"
## example: HELM_ARGUMENTS="--set hello=world"
_HELM_ARGUMENTS="${HELM_ARGUMENTS:-}"
_IMAGE_TAG_KEY="${IMAGE_TAG_KEY:-image.tag}"

validate() {
  ## jq: json query cli (default in github action)
  command -v jq >/dev/null ||
    __error "'jq' command is required"
}

main() {
  local app_path="$_WORKDIR/$DEPLOY_DIR/$_APP_NAME"
  local conf_path="$app_path/$CONFIG_FILE"

  cd "$app_path" ||
    __error "invalid app name: '%s'" \
      "$_APP_NAME"
  test -f "$conf_path" ||
    __error "missing '%s' from '%s'" \
      "$CONFIG_FILE" "$_APP_NAME"

  ## Login AWS
  local eks_config_args=()
  eks_config_args+=(eks update-kubeconfig)
  eks_config_args+=(--name "$_EKS_CLUSTER_NAME")
  eks_config_args+=(--region "$_AWS_REGION")
  test -n "$_DEBUG" &&
    eks_config_args+=(--debug)
  __exec "$AWS_CMD" "${eks_config_args[@]}" ||
    return $?

  ## Pass values from config.json file
  local schema chart_name chart_version release_name chart values_name namespace
  schema="$(__config_get "schema" \
    ".schema" "$conf_path" "oci")"
  chart_name="$(__config_get "chartName" \
    ".chart" "$conf_path")"
  chart_version="$(__config_get "chartVersion" \
    ".chartVersion" "$conf_path" "latest")"
  release_name="$(__config_get "releaseName" \
    ".name" "$conf_path")"
  namespace="$(__config_get "namespace" \
    ".environments.$_ENVIRONMENT.namespace" "$conf_path")"
  values_name="$(__config_get "valuesName" \
    ".environments.$_ENVIRONMENT.values" "$conf_path")"
  values_name="$(__config_get "valuesName" \
    ".environments.$_ENVIRONMENT.values" "$conf_path")"
  chart="$(__chart_build "$schema" "$chart_name")"

  local values_path="$app_path/$values_name"
  ## If values.yaml not found, throw error
  test -f "$values_path" ||
    __error "cannot deploy '%s' file not found ('%s')" \
      "$_ENVIRONMENT" "$values_path"
  ## If override chart version exist, override current value
  test -n "$_CHART_VERSION" &&
    chart_version="$_CHART_VERSION"

  ## If recreate is enabled, uninstall old chart before install new one
  if test -n "$_RECREATE"; then
    local helm_uninstall_args=(uninstall "$release_name")
    helm_uninstall_args+=(--wait --timeout "$_HELM_TIMEOUT")
    test -n "$_DEBUG" &&
      helm_uninstall_args+=(--debug)
    helm_uninstall_args+=(--namespace "$namespace")
    __exec "$HELM_CMD" "${helm_uninstall_args[@]}"
  fi

  ## Parse values file if it's extension is .tpl
  if [[ "$values_name" =~ \.tpl$ ]]; then
    local new_values_path="/tmp/values.yaml"
    __parse_value "$(cat "$values_path")" >"$new_values_path"
    values_path="$new_values_path"
  fi

  ## Run helm upgrade or install new chart
  local helm_args=()
  helm_args+=(upgrade --install)
  test -n "$_FORCE" &&
    helm_args+=(--force)
  helm_args+=(--wait --atomic)
  test -n "$_DEBUG" &&
    helm_args+=(--debug)
  helm_args+=(--namespace "$namespace")
  test -f "$app_path/$VALUES_FILE" &&
    helm_args+=(--values "$app_path/$VALUES_FILE")
  helm_args+=(--values "$values_path")
  helm_args+=(--timeout "$_HELM_TIMEOUT")
  helm_args+=("$release_name" "$chart")
  [[ "$chart_version" != "latest" ]] &&
    helm_args+=(--version "$chart_version")
  test -n "$_APP_VERSION" &&
    helm_args+=(--set "${_IMAGE_TAG_KEY}=${_APP_VERSION}")
  ## Force separate by space when enter extra arguments
  test -n "$_HELM_ARGUMENTS" &&
    helm_args+=($_HELM_ARGUMENTS)
  __exec "$HELM_CMD" "${helm_args[@]}" ||
    return $?
}

clean() {
  unset HELM_CMD \
    AWS_CMD \
    DEPLOY_DIR \
    CONFIG_FILE \
    VALUES_FILE

  unset _DRYRUN \
    _DEBUG \
    _FORCE \
    _WORKDIR \
    _APP_NAME \
    _APP_VERSION \
    _ENVIRONMENT \
    _EKS_CLUSTER_NAME \
    _HELM_TIMEOUT \
    _HELM_ARGUMENTS \
    _AWS_REGION \
    _AWS_ECR_REGISTRY \
    _IMAGE_TAG_KEY
}

__error() {
  local format="$1"
  shift
  local args=("$@")

  # shellcheck disable=SC2059
  printf "$format\n" "${args[@]}" >&2
  exit 1
}

__exec() {
  local cmd="$1" args=()
  shift
  args=("$@")

  printf "running '%s' %s\n" \
    "$cmd" "${args[*]}"

  if test -z "$_DRYRUN"; then
    "$cmd" "${args[@]}"
  fi
}

__jq() {
  local query="$1" path="$2"
  jq --monochrome-output --raw-output \
    "$query" "$path"
}

__chart_build() {
  local schema="$1" input="$2"
  if [[ "$schema" == "oci" ]]; then
    printf "%s://%s" \
      "$schema" "$input"
    return 0
  fi

  __error "cannot build chart from '%s' schema" \
    "$schema"
}

__config_get() {
  local name="$1" query="$2" path="$3"
  local default_value="$4" null_value="null"
  local value
  value="$(__jq "$query" "$path")"

  if [[ "$value" == "$null_value" ]]; then
    if ! test -n "$default_value"; then
      __error "'%s' is a require json field" \
        "$name"
    else
      __parse_value "$default_value"
    fi
  else
    __parse_value "$value"
  fi
}

__parse_value() {
  local input="$1" code=0
  eval "printf '%s' \"$input\""
  code=$?

  if [ "$code" -gt 0 ]; then
    __error "Cannot parse value"
  fi
}

validate || exit $?
main "$@" || exit $?
clean || exit $?

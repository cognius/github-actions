#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e #ERROR    - Force exit if error occurred.

_prefix="${IMAGE_PREFIX:-}"
_pkg="${CR_PACKAGE_PATH:-.cr-release-packages}"

_aws_region="${AWS_REGION:?}"
_aws_account="${AWS_ACCOUNT_ID:-}"
_aws_registry="${AWS_ECR_REGISTRY:-$_aws_account.dkr.ecr.$_aws_region.amazonaws.com}"

main() {
  if ! command -v aws >/dev/null; then
    printf "[ERR] 'aws' command is required" >&2
    exit 1
  fi
  if test -z "$AWS_ACCOUNT_ID" && test -z "$AWS_ECR_REGISTRY"; then
    printf "[ERR] either '%s' or '%s' must provided" \
      "AWS_ACCOUNT_ID" "AWS_ECR_REGISTRY" >&2
    exit 1
  fi

  _aws_login

  local oci="oci://$_aws_registry"
  test -n "$_prefix" && oci="$oci/$_prefix"

  for path in "$_pkg"/*.tgz; do
    if ! test -f "$path"; then
      _exec helm push "$path" "$oci"
    else
      _warn "file not found at '%s'" "$path"
    fi
  done
}

_aws_login() {
  local aws_username="AWS"

  if test -z "$DRYRUN"; then
    aws ecr get-login-password --region "$_aws_region" |
      helm registry login \
        --username "$aws_username" --password-stdin \
        "$_aws_registry"
  else
    _exec aws ecr get-login-password --region "$_aws_region"
    _exec helm registry login \
      --username "$aws_username" --password-stdin "$_aws_registry"
  fi
}

_warn() {
  local format="$1"
  shift
  # shellcheck disable=SC2059
  printf "[WRN] $format\n" "$@" >&2
}

_exec() {
  printf "$ %s\n" "$*"
  if test -z "$DRYRUN"; then
    "$@"
  fi
}

main

unset _prefix _pkg
unset _aws_account _aws_region _aws_registry

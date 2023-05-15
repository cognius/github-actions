#!/usr/bin/env bash

prefix="${PREFIX_NAME:?}"
pkg_path="${PACKAGE_PATH:-.cr-release-packages}"

aws_account_id="${AWS_ACCOUNT_ID:?}"
aws_region="${AWS_REGION:?}"

aws_username="AWS"
aws_ecr_arn="$aws_account_id.dkr.ecr.$aws_region.amazonaws.com"

aws ecr get-login-password \
  --region "$aws_region" |
  helm registry login \
    --username "$aws_username" \
    --password-stdin "$aws_ecr_arn"

for path in "$pkg_path"/*.tgz; do
  if test -f "$path"; then
    echo "pushing '$path' to ECR"
    helm push "$path" "oci://$aws_ecr_arn/$prefix"
  else
    echo "file not found at '$path'"
  fi
done

#!/usr/bin/env bash

## env:
##   REPOSITORIES: |
##     kafka-ui=https://provectus.github.io/kafka-ui
##     prometheus-community=https://prometheus-community.github.io/helm-charts

_HELM_CMD="helm"
if test -n "$REPOSITORIES"; then
  # shellcheck disable=SC2206
  repo=($REPOSITORIES)
  for raw in "${repo[@]}"; do
    name="${raw%%=*}"
    url="${raw##*=}"

    "$_HELM_CMD" repo add "$name" "$url"
  done
fi

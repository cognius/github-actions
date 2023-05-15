#!/usr/bin/env bash

basepath="$HELM_DIRECTORY"

custom_values="$ENVIRONMENT-values.yaml"
values="values.yaml"

if test -f "$basepath/$custom_values"; then
  values="$custom_values"
fi

echo "values-path=$basepath/$values"
echo "helm-directory=$basepath"

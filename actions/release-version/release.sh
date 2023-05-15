#!/usr/bin/env bash

tag="${TAG_NAME:?}"
component="${COMPONENT:?}"
app_path="${APP_PATH:?}"

## Create git tag on local
git tag "$tag"

## Generate release note
tmp="/tmp/__RELEASE_NOTE.md"
note="/tmp/RELEASE_NOTE.md"
if command -v "git-chglog" >/dev/null; then
  git-chglog \
    --path "$app_path" \
    --tag-filter-pattern "^$component/v" \
    --output "$tmp" \
    "$tag"
  echo "$tag" >"$note"
  echo "" >>"$note"
  tail -n +3 "$tmp" >>"$note"
fi

## Upload git tag to Github Release
if command -v "hub" >/dev/null; then
  hub release create \
    --file "$note" \
    "$tag"
fi

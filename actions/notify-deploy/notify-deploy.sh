#!/usr/bin/env bash

type="${NOTIFY_TYPE:?}"
step="${NOTIFY_STEP:?}"
enabled="${NOTIFY_ENABLED:-true}"
component="${COMPONENT:?}"
env="${ENVIRONMENT:?}"
webhook="${SLACK_WEBHOOK:?}"

mode="${RELEASE_MODE:?}"
version="${RELEASE_VERSION:?}"

git_repo="${GIT_REPO:?}"
git_ref="${GIT_REF:?}"
git_author="${GIT_AUTHOR:?}"
git_commit="${GIT_COMMIT:?}"
gh_id="${GITHUB_ACTION_ID:?}"

gh_commit_url="https://github.com/$git_repo/commit/$git_commit"
gh_action_url="https://github.com/$git_repo/actions/runs/$gh_id"

gh_commit_link="<$gh_commit_url|$git_ref>"
gh_action_link="<$gh_action_url|$gh_id>"

if test -z "$enabled" ||
  [[ "$enabled" == false ]]; then
  printf "disable notification\n"
  exit 0
fi

message=""
case "$type" in
start)
  [[ "$env" == "production" ]] && [[ "$git_ref" != "main" ]] &&
    message+="<!here> "
  message+="*$git_author* starting $mode \`${component}[$version]\`"
  message+=" from $gh_commit_link"
  message+=" to *$env*"
  message+=" ($gh_action_link)"
  ;;
error | failure)
  message+="<!here> Finished *$step* with \`error\`"
  message+=", please check $gh_action_link"
  ;;
success)
  message+="Finished *$step* successfully ($gh_action_link):
  "
  message+="*Component name*: $component
  "
  message+="*Environment*: $env
  "
  message+="*Version*: $version
  "
  message+="*Reference*: $gh_commit_link"
  ;;
esac

printf "sending message: %s\n" "$message"
if test -n "$message"; then
  curl -X POST \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"$message\"}" \
    "$webhook"
fi

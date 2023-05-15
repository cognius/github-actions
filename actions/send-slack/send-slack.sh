#!/usr/bin/env bash

message="${MESSAGE_TEXT:?}"
webhook="${WEBHOOK_URL:?}"

curl \
  -X POST \
  --data-urlencode "payload={\"text\": \"$message\"}" \
  "$webhook"

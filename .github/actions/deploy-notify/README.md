# Deployment notification action

Notify when someone deploying something on Slack

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Notify on Slack
        uses: cognius/github-actions/.github/actions/deploy-notify@v2
        env:
          NOTIFY_TYPE: start|success|failure|cancelled
          # NOTIFY_DISABLED: false
          # NOTIFY_ACTION: deploy
          # NOTIFY_STEP: build
          APP_NAME: test
          # APP_VERSION: v1.0.0
          # APP_ENV: production
          SLACK_WEBHOOK: https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXXXX
```

## Environment

### Notify type

`NOTIFY_TYPE` is a type of notification, either type has it own message format.
Possible values are 'start', 'failure', 'success', 'complete'.

You can easy use `${{ job.status }}` from GitHub Context on result notify.

```yaml
- name: Report deploy result
  uses: cognius/github-actions/.github/actions/deploy-notify@v2
  env:
    NOTIFY_TYPE: "${{ job.status }}"
```

### Notify disabled

`NOTIFY_DISABLED` flag to disable notification on special condition (default is **false**).
Only **empty string** and **false** are considers as enabled;
otherwise, will disable notification.

```bash
## Enabled notification
NOTIFY_DISABLED=
NOTIFY_DISABLED=false
unset NOTIFY_DISABLED
## Disabled notification
NOTIFY_DISABLED=true
NOTIFY_DISABLED=1
NOTIFY_DISABLED=string
```

### Notify action

`NOTIFY_ACTION` is a freeform string (preferrable verb) describe what is action current perform.

### Notify step

`NOTIFY_STEP` is a freeform string (preferrable verb) describe
which steps on action that report result.

### Application name

`APP_NAME` is a name of deploying application (required).

### Application version

`APP_VERSION` is a version of deploying application (default is **empty**).

### Application environment

`APP_ENV` is a deploying environment (default is **empty**).
This only matter when deploy on `production` environment.

### Slack webhook

> https://api.slack.com/messaging/webhooks

`SLACK_WEBHOOK` is a URL string of slack webhook (required).

## Development

To testing locally without Github Action.

```bash
DRYRUN=true \
  NOTIFY_TYPE=start APP_NAME=test \
  SLACK_WEBHOOK=https://google.com \
  GITHUB_REPOSITORY=test/local GITHUB_REF_TYPE=branch GITHUB_REF_NAME=main \
  GITHUB_ACTOR=guest GITHUB_SHA=abc GITHUB_RUN_ID=1 \
  ./.github/actions/deploy-notify/index.sh
```

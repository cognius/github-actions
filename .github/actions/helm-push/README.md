# Push helm action

Publish helm-charts on Github Release and push to registry

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    permissions:
      ## To create GitHub Release
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Push helm-charts
        uses: cognius/github-actions/.github/actions/helm-push@v2
        env:
          AWS_ACCOUNT_ID: 111222333444
          AWS_REGION: us-east-1
          # AWS_ECR_REGISTRY: 111222333444.dkr.ecr.us-east-1.amazonaws.com
          # IMAGE_PREFIX: helm-charts
          # CR_PACKAGE_PATH: .cr-release-packages
          # REPOSITORIES: |
          #   kafka-ui=https://provectus.github.io/kafka-ui
          #   prometheus-community=https://prometheus-community.github.io/helm-charts
```

## Environment

### AWS account id

`AWS_ACCOUNT_ID` is a AWS account id for pushing ECR (required).

### AWS region

`AWS_REGION` is a AWS region of pushing ECR (required).

### AWS ECR registry

`AWS_ECR_REGISTRY` is a AWS ECR registry url
(default is **<account-id>.dkr.ecr.<region>.amazonaws.com**).

### Helm image prefix

`IMAGE_PREFIX` is a image prefix when publish to ECR.
This useful when you publishing helm-charts on path prefix.

```bash
## This will publish image to <arn>/helm-charts/<application>
IMAGE_PREFIX=helm-charts
```

### Chart releaser package path

> https://github.com/helm/chart-releaser#create-github-releases-from-helm-chart-packages

`CR_PACKAGE_PATH` is a output of chart-releaser package.
You should use this only when you customize `--package-path` options on chart-releaser;
Otherwise, leave it empty.

### Helm repositories

> This used by `add-repo.sh` script

`REPOSITORIES` is for adding helm repository to local registry.
This is newline separated array where
each line is repo name and repo url separated by equals sign (`=`).

```bash
## <name>=<url>
REPOSITORIES="
kafka-ui=https://provectus.github.io/kafka-ui
prometheus-community=https://prometheus-community.github.io/helm-charts
"
```

## Development

To testing locally without Github Action.

```bash
REPOSITORIES="" ./.github/actions/helm-push/add-repo.sh

DRYRUN=1 \
  AWS_ACCOUNT_ID=111222333 AWS_REGION=us-east-1 \
  ./.github/actions/helm-push/push.sh
```

# Install helm action

Install helm-charts to target Kubernetes

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      ## Login to AWS
      - uses: aws-actions/configure-aws-credentials@v3
      - ...
      - name: Deploy helm-charts to Kubernetes
        uses: cognius/github-actions/.github/actions/helm-install@v2
        env:
          APP_ENV: production
          APP_NAME: test
          # APP_VERSION: v1.0.0
          AWS_ACCOUNT_ID: 111222333444
          AWS_REGION: us-east-1
          AWS_EKS_CLUSTER_NAME: sumato-2
          # AWS_ECR_REGISTRY: 111222333444.dkr.ecr.us-east-1.amazonaws.com
          # HELM_DEBUG: false
          # HELM_FORCE: false
          # HELM_RECREATE: false
          # HELM_TIMEOUT: 5m
          # HELM_IMAGE_TAG_KEY: image.tag
          # HELM_CHART_VERSION: 0.1.0
          # HELM_UNINSTALL_ARGUMENTS: --dry-run
          # HELM_UPGRADE_ARGUMENTS: --set example=true
          # DEPLOY_DIR: deploys
          # DEPLOY_CONFIG_FILE: config.json
          # APP_PATH: /apps
          # CONFIG_PATH: /apps/configs/config.json
          # ROOT_PATH: /
```

## Environment

### Application environment

`APP_ENV` is a requires field to resolve
environment key in config file (config.json).

### Application name

`APP_NAME` is will use to resolve
configuration directory ([here](#application-path)).

### Application version

`APP_VERSION` is a specific version to deploys;
otherwise, will use default value in **values.yaml**.

### AWS account id

`AWS_ACCOUNT_ID` is a AWS account id for pushing ECR (required).

### AWS region

`AWS_REGION` is a AWS region of pushing ECR (required).

### AWS EKS cluster name

`AWS_EKS_CLUSTER_NAME` is a name of the cluster to deploy (required).

### AWS ECR registry

`AWS_ECR_REGISTRY` is a AWS ECR registry url
(default is **<account-id>.dkr.ecr.<region>.amazonaws.com**).

### Helm debug

`HELM_DEBUG` will enabled debug logs when running helm command
(default is **false**).

### Helm force

`HELM_FORCE` will force resource updates through a replacement strategy
(default is **false**).

### Helm recreate

`HELM_RECREATE` will uninstall resource before install again
(default is **false**).

### Helm timeout

`HELM_TIMEOUT` set timeout of all helm commands (default is **5m**).
Increase this will also increase deployment time when deploy failed.

### Helm image tag key

`HELM_IMAGE_TAG_KEY` to override yaml key for
overriding application version (if exist [here](#application-version)).
The default value is `image.tag`.

```bash
## This will override yaml below
## image:
##   tag: <version>
HELM_IMAGE_TAG_KEY=image.tag
```

### Helm chart version

`HELM_CHART_VERSION` is a version of helm-chart to deploy (default is **latest**).
This useful when you would like to rollback helm-charts or testing your custom charts.

### Helm uninstall arguments

`HELM_UNINSTALL_ARGUMENTS` is a raw arguments passed to `helm uninstall` command.

### Helm upgrade arguments

`HELM_UPGRADE_ARGUMENTS` is a raw arguments passed to `helm upgrade --install` command.

### Deployment directory

`DEPLOY_DIR` is a directory name that contains
deployment configs and values (default is **deploys**).

### Deployment config name

`DEPLOY_CONFIG_FILE` is a file name of deployment config (default is **config.json**).

### Application path

`APP_PATH` is a root directory for all relative filepath will resolve from.
The default template is `$ROOT_PATH/$DEPLOY_DIR/$APP_NAME`
where [ROOT_PATH](#root-path), [DEPLOY_DIR](#deployment-directory)
and [APP_NAME](#application-name)

### Configuration path

`CONFIG_PATH` is a absolute path to config file.
Setting this will ignore `APP_PATH`, `DEPLOY_CONFIG_FILE`.
The default template is `$APP_PATH/$DEPLOY_CONFIG_FILE`
where [APP_PATH](#application-path), and [DEPLOY_CONFIG_FILE](#deployment-config-name)

### Root path

`ROOT_PATH` is a root directory for
all relative path to resolve from (default is `$PWD`).

## Development

To testing locally without Github Action.

```bash
DRYRUN=true \
  AWS_ACCOUNT_ID=111222333444 AWS_REGION=us-east-1 AWS_EKS_CLUSTER_NAME=sumato-2 \
  APP_ENV=dev APP_NAME=test \
  ROOT_PATH=$PWD/.tests/helm-install \
  ./.github/actions/helm-install/index.sh
```

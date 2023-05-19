# Helm install (deployment)

This action will read the configuration and install helm-charts based on that configuration.

## Configuration

File name `config.json` placed at `deploys` directory (**./deploys/config.json**).
You can specific [variables](#configuration-variables) on this file (using bash variables syntax).

```json
{
  "type": "oci",
  "chart": "${AWS_ECR_REGISTRY:?}/helm-charts/<chart_name>",
  "chartVersion": "latest",
  "name": "<name>",
  "environments": {
    "<environment_name>": {
      "namespace": "<kube_namespace>",
      "values": "<values-file.yaml>"
    }
  }
}
```

### Type

The helm-chart type: this should always be `oci`.
This is optional fields, the default always be `oci`.

### Chart

When type is `oci`, chart should be full link to oci registry.
(e.g. example.com/helm-chart/test).

### Chart Version

Specific chart version to install, the default is `latest` which always fetch latest
chart from ECR registry.

### Name

Release name when run `helm install`.

### Environments

The object for environment specific settings.

#### Environment namespace

The Kubernetes namespace of each environment should deploy to.

#### Environment values

The override values files to override default value from helm-charts.

## Configuration variables

| Name             | Status   | Description         |
|------------------|----------|---------------------|
| AWS_ECR_REGISTRY | Required | ECR Registry name   |
| EKS_CLUSTER_NAME | Required | EKS Cluster name    |
| ENVIRONMENT      | Required | Environment name    |
| APP_NAME         | Required | Application name    |
| APP_VERSION      | Optional | Application version |

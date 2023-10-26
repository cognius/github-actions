# Create hosts action

create hosts mapping to input ip (using [static table lookup][static-table-lookup-url]).

[static-table-lookup-url]: https://www.man7.org/linux/man-pages/man5/hosts.5.html

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: cognius/github-actions/create-hosts@v3
        with:
            domains: |
                hostname.com,newhostname.com
                secondhost.com,newsecondhost.com
            # ip: 127.0.0.1
            # dryrun: true
```

## Configurations

A parsed input send to actions. You have 2 options to configure a value:

1. using [with][steps-with-url] field. (This should be `kebab-case`)
2. using [env][steps-env-url] field. (This should be `UPPER_CASE` and prefix with application name and `__`)
    - Example: `CREATE_HOSTS__NAME`

[steps-with-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith
[steps-env-url]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsenv

### Domains

`domains` is a requires **comma** or **newline** separated aliases host to [ip](#ip-address).

| Input   | Environment | Alternative Environment |
| ------- | ----------- | ----------------------- |
| domains | DOMAINS     | CREATE_HOSTS__DOMAINS   |

### IP address

`ip` is a IP address for hostname to resolve to (default is **127.0.0.1**).

| Input | Environment | Alternative Environment |
| ----- | ----------- | ----------------------- |
| ip    | IP          | CREATE_HOSTS__IP        |

### Dryrun

`dryrun` will enabled dry-run mode instead of running actual command.

| Input  | Environment | Alternative Environment |
| ------ | ----------- | ----------------------- |
| dryrun | DRYRUN      | CREATE_HOSTS__DRYRUN    |

## Source code

> [github-actions-private#action/create-hosts][source-code-url]

If you cannot open source code, meaning you don't have permission to open it.

[source-code-url]: https://github.com/cognius/github-actions-private/tree/main/actions/src/create-hosts

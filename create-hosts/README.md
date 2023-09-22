# Create hosts action

create hosts mapping to input ip (using [static table lookup][hosts.5-manpage])

[hosts.5-manpage]: https://www.man7.org/linux/man-pages/man5/hosts.5.html

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Create hosts
        uses: cognius/github-actions/create-hosts@v2
        with:
            hosts: |
                hostname.com,newhostname.com
                secondhost.com,newsecondhost.com
            # ip: 127.0.0.1
        env:
            DRYRUN: true
```

## Inputs

A input values parsed to action using `with` field in **steps** objects.

### Hosts

`hosts` is a requires comma or newline separated aliases host to [ip](#ip-address).

### IP address

`ip` is a IP address for hostname to resolve to (default is **127.0.0.1**).

### Example

`example` is a example input.

## Environments

A environment parsed to action using `env` field in **steps** objects.

### Dryrun mode

`DRYRUN` will enabled dry-run mode instead of running actual code.

## Source code

[here](https://github.com/cognius/github-actions/tree/v2/.actions/src/create-hosts)

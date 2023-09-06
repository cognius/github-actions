# Host aliases action

Create host aliases using **/etc/hosts** file

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Create host aliases
        uses: cognius/github-actions/.github/actions/host-aliases@v2
        env:
          HOSTS: hostname.com,newhostname.com
          # HOSTS_LOCALHOST: 127.0.0.1
          # HOSTS_FILE: /etc/hosts
```

## Environments

### Hosts

`HOSTS` is comma/newline separated hostname to create as alias to localhost.
Example below:

```bash
HOSTS='
host1.com,host2.com
host3.com,host4.com
'
```

### Localhost

`HOSTS_LOCALHOST` is target of aliases (default is **127.0.0.1**).

### Host file

`HOSTS_FILE` is a file to write aliases to (default is **/etc/hosts**)

## Development

To testing locally without Github Action.

```bash
HOSTS=hostname.com,newhostname.io \
  HOSTS_FILE=/dev/null \
  ./.github/actions/host-aliases/index.sh
```

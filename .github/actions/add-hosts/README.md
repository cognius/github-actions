# Add host aliases action

Create host aliases using **/etc/hosts** file

## Usage

```yaml
- name: Create host aliases
  uses: cognius/github-actions/.github/actions/add-hosts@v2
  env:
    HOSTS: hostname.com,newhostname.com
    # HOSTS_LOCALHOST: 127.0.0.1
    # HOSTS_FILE: /etc/hosts
```

## Environments

### Hosts

`HOSTS` is comma/newline separated hostname to create as alias to localhost.

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

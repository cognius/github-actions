# Server action action

Perform action to target server.

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Run script
        uses: cognius/github-actions/.github/actions/server@v2
        env:
          # SERVER_ACTION: connect
          SERVER_TARGET: 127.0.0.1
          SERVER_USERNAME: ec2-user
          SERVER_PRIVATE_KEY_BASE64: cHJpdmF0ZS1rZXkK
          SERVER_PUBLIC_FINGERPRINT: ssh-ed25519 AAAAC3N
          # SERVER_CONNECT_SCRIPT: |
          #   echo 'running on server'
          #   pwd && hostname && uname

          # SERVER_COPY_BASE: .
          # SERVER_COPY_DEST: target
```

## Environment

### Server action

`SERVER_ACTION` is a action perform on server (default is **connect**).
Below are a supported values list:

- `connect` - requires [SERVER_CONNECT_SCRIPT](#server-connect-script)
- `copy` - requires [SERVER_COPY_BASE](#server-copy-base) [SERVER_COPY_DEST](#server-copy-destination)

### Server target

`SERVER_TARGET` is a target IP or hostname,
this will pass to ssh command directly so
please ensure that your ip/hostname is internal accessable.

### Server username

`SERVER_USERNAME` is a username for connecting to server.

### Server private key

`SERVER_PRIVATE_KEY_BASE64` is a base64 of private key
to authenication with server.

### Server fingerprint

`SERVER_PUBLIC_FINGERPRINT` is a fingerprint of target server.
You can get this information from `ssh-keyscan -t rsa <target>`.
Please remove hostname from output before add to this variable.

```bash
## Fingerprint of Github server
SERVER_PUBLIC_FINGERPRINT='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk='
```

### Server connect script

`SERVER_CONNECT_SCRIPT` is a bash script string
(requires when [action](#server-action) is **connect**).

```bash
SERVER_CONNECT_SCRIPT='hostname'
```

### Server copy base

`SERVER_COPY_BASE` is a base directory on current machine to copy from.

### Server copy destination

`SERVER_COPY_DEST` is a target directory on target server to copy to.

## Development

To testing locally without Github Action.

```bash
DRYRUN=1 SERVER_ACTION=connect \
  SERVER_TARGET=127.0.01 SERVER_USERNAME=ec2-user \
  SERVER_PRIVATE_KEY_BASE64=cHJpdmF0ZS1rZXkK SERVER_PUBLIC_FINGERPRINT=abc \
  SERVER_CONNECT_SCRIPT=pwd \
  TEMP_PRIVATE_KEY="$(mktemp)" \
  ./.github/actions/server/index.sh
```

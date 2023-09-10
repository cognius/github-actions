# Server script action

Run script on server using ssh

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Run script
        uses: cognius/github-actions/.github/actions/server-script@v2
        env:
          SERVER_TARGET: 127.0.0.1
          SERVER_USERNAME: ec2-user
          SERVER_PRIVATE_KEY_BASE64: abc123==
          # SERVER_SCRIPT: |
          #   echo 'running on server'
          #   pwd && hostname && uname
          # SERVER_FILE: scripts/setup.sh
```

## Environment

### Server target

`SERVER_TARGET` is a target IP or hostname,
this will pass to ssh command directly so
please ensure that your ip/hostname is internal accessable.

### Server username

`SERVER_USERNAME` is a username for connecting to server.

### Server private key

`SERVER_PRIVATE_KEY_BASE64` is a base64 of private key
to authenication with server.

### Server script

`SERVER_SCRIPT` is a bash script content
(conflict with [SERVER_FILE](#server-file)). 

### Server file

`SERVER_FILE` is a bash script file
(conflict with [SERVER_SCRIPT](#server-script)).

This file is resolved on current directory of host machine (NOT target machine).
The Actions will copy this file to server by itself,
you don't need to manually copy beforehand.

## Development

To testing locally without Github Action.

```bash
DRYRUN=1 \
  SERVER_TARGET=127.0.01 SERVER_USERNAME=ec2-user \
  SERVER_PRIVATE_KEY_BASE64=cHJpdmF0ZS1rZXkK \
  SERVER_SCRIPT=pwd \
  TEMP_PRIVATE_KEY="$(mktemp)" \
  ./.github/actions/server-script/index.sh
```

#!/usr/bin/env bash

# set -x #DEBUG    - Display commands and their arguments as they are executed.
# set -v #VERBOSE  - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.
set -e   #ERROR    - Force exit if error occurred.

_hosts=${HOSTS:?}

_hostlocal="${HOSTS_LOCALHOST:-127.0.0.1}"
_hostfile="${HOSTS_FILE:-/etc/hosts}"

for _host in ${_hosts//,/ }; do
    echo "$_hostlocal  $_host" | sudo tee -a "$_hostfile"
done

unset _hosts _host _hostlocal _hostfile

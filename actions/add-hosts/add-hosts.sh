#!/usr/bin/env bash

_hosts=${HOSTS:?}

_hostlocal="${HOSTS_LOCALHOST:-127.0.0.1}"
_hostfile="${HOSTS_FILE:-/etc/hosts}"

for host in ${_hosts//,/ }; do
    echo "$_hostlocal  $host" | sudo tee -a "$_hostfile"
done

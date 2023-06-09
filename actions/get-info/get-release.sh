#!/usr/bin/env bash

## $ get-release.sh mode [app-name] [override]
##          => "deploy" | "redeploy"
## $ get-release.sh full-version [app-name] [override]
##          => "app-name/<version>" (version is semver compliance)
## $ get-release.sh version [app-name] [override]
##          => "<version>" (version is semver compliance)

__VERSION_APP_SEP="/"
__VERSION_PREFIX="v"
__VERSION_PREFIX_WHITELIST=("v" "sha-")
__VERSION_SEP="."
__VERSION_MAX_INDEX=999
__VERSION_TIMESTAMP="%Y.%-W"

get_mode() {
  local app="$1" override="$2"
  local version

  if test -n "$override"; then
    version="$override"
  else
    version="$(_current_version "$app")"
  fi

  _debug "check version" "$version"
  if _has_version "$version"; then
    printf "%s" "redeploy"
  else
    printf "%s" "deploy"
  fi
}

get_version() {
  local app="$1" override="$2"
  local full_version
  full_version="$(get_full_version "$app" "$override")"
  printf "%s" "${full_version##*"$__VERSION_APP_SEP"}"
}

get_full_version() {
  local app="$1" override="$2"

  if test -n "$override"; then
    _debug "result" "using override tag"
    printf "%s" "$override"
    return 0
  fi

  local tag
  tag="$(_current_version "$app")"
  if test -n "$tag"; then
    _debug "result" "using old tag"

    ## Return old tag when
    ## current commit contains git tag
    printf "%s" "$tag"
    return 0
  fi

  tag="$(_generate_version "$app")"
  _debug "result" "creating new tag"
  printf "%s" "$tag"
  return 0
}

main() {
  ## action = mode | full-version | version
  local action="$1" app="$2" version="$3"

  local override
  override="$(_build_override_version "$app" "$version")"
  _debug "override version" "$override"
  case "$action" in
  m | mode)
    _debug "action name" "mode"
    get_mode "$app" "$override"
    ;;
  v | version)
    _debug "action name" "version"
    get_version "$app" "$override"
    ;;
  fv | full-version)
    _debug "action name" "full-version"
    get_full_version "$app" "$override"
    ;;
  esac
}

## print debug message if $DEBUG exist
## _debug "$title" "string"
_debug() {
  # enable debug only if $DEBUG no empty
  if test -n "$DEBUG"; then
    local title="$1"
    shift 1
    printf "%-20s: %s\n" "$title" "$*" >&2
  fi
}

## generate version based on datetime
## _generate_version "$app"
_generate_version() {
  local app="$1" index=1
  local timestamp tag exist
  timestamp="$(date +"$__VERSION_TIMESTAMP")"

  while true; do
    if [ "$index" -gt "$__VERSION_MAX_INDEX" ]; then
      printf "ERROR: %s" "your version has reached the limit, try again later" >&2
      exit 2
    fi

    tag="$(_build_version "$app" "$timestamp" "$index")"
    _debug "check version" "$tag"

    if ! _has_version "$tag"; then
      printf "%s" "$tag"
      return 0
    fi

    ((index++))
  done
}

## get current version (on current commit SHA) by app name
## _current_version "$app"
_current_version() {
  local app="$1" version
  version="$(_build_version "$app" "*")"

  _debug "get version" "$version"

  git describe \
    --tags \
    --exact-match \
    --match "$version" 2>/dev/null
}

## build version string with app name
## _build_version "$app" "1" "1" "1" => app/v1.1.1
_build_version() {
  local app="$1" output
  shift

  for input in "$@"; do
    if test -n "$output"; then
      if [[ "$input" =~ ^[+-] ]]; then
        output="$output$input"
      else
        output="$output$__VERSION_SEP$input"
      fi
    else
      output="$(_add_version_prefix "$input")"
    fi
  done

  if test -n "$app"; then
    output="$app$__VERSION_APP_SEP$output"
  fi

  printf "%s" "$output"
}

## build override version string with app name
## _build_override_version "$app" "v1.0.0" => app/v1.0.0
_build_override_version() {
  local app="$1" override="$2"
  if test -z "$override"; then
    return 0
  fi

  override="$(_add_version_prefix "$override")"
  if test -n "$app"; then
    printf "%s%s%s" "$app" "$__VERSION_APP_SEP" "$override"
  else
    printf "%s" "$override"
  fi
}

_add_version_prefix() {
  local whitelist version="$1"
  local prefix="$__VERSION_PREFIX"

  for whitelist in "${__VERSION_PREFIX_WHITELIST[@]}"; do
    if [[ "$override" =~ ^$whitelist ]]; then
      prefix=""
      break
    fi
  done

  printf '%s%s' "$prefix" "$version"
}

## Check input tag version exist or not
## _has_version "v1.0.0"
_has_version() {
  local tag="$1" exist
  exist="$(git tag -l "$tag")"

  test -n "$exist"
}

######################################################################

main "$@"

unset __VERSION_APP_SEP \
  __VERSION_PREFIX \
  __VERSION_PREFIX_WHITELIST \
  __VERSION_SEP \
  __VERSION_MAX_INDEX \
  __VERSION_TIMESTAMP

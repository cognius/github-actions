#!/usr/bin/env bash

## $ get-release.sh mode
##          => "deploy" | "redeploy"
## $ get-release.sh full-version app-name [override]
##          => "app-name/<version>"
## $ get-release.sh version app-name [override]
##          => "<version>"

__VERSION_APP_SEP="/"
__VERSION_PREFIX="v"
__VERSION_SEP="."
__VERSION_MAX_INDEX=99
__VERSION_TIMESTAMP="%Y%m%d"

get_mode() {
  local app="$1" override="$2"
  local version

  if test -n "$override"; then
    version="$(_build_override_version "$app" "$override")"
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
    _build_override_version "$app" "$override"
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

  case "$action" in
  m | mode)
    _debug "action name" "mode"
    get_mode "$app" "$version"
    ;;
  v | version)
    _debug "action name" "version"
    get_version "$app" "$version"
    ;;
  fv | full-version)
    _debug "action name" "full-version"
    get_full_version "$app" "$version"
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
    printf "%-15s: %s\n" "$title" "$*" >&2
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
      printf "ERROR: %s" "too many released version on same day" >&2
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

  local inputs=("$@")
  for input in "${inputs[@]}"; do
    if [[ "$input" =~ $__VERSION_APP_SEP ]]; then
      output="${inputs[*]}"
      printf "%s" "${output// /}"
      return 0
    fi

    if test -n "$output"; then
      output="$output$__VERSION_SEP$input"
    else
      if [[ "$input" =~ ^$__VERSION_PREFIX ]]; then
        output="$input"
      else
        output="$__VERSION_PREFIX$input"
      fi
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
  printf "%s%s%s" "$app" "$__VERSION_APP_SEP" "$override"
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
  __VERSION_SEP \
  __VERSION_MAX_INDEX \
  __VERSION_TIMESTAMP

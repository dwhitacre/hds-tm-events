#!/usr/bin/env bash

REPO_ROOT=$(git rev-parse --show-toplevel)
API_DIR=$REPO_ROOT/api
PLAYER_DIR=$API_DIR/player

if ! test -d $PLAYER_DIR; then
  echo "player dir dne: $PLAYER_DIR"
  exit 1
fi

function _usage {
  echo "Usage:"
  echo "  $0 [name]"
  exit 1
}

NAME=$1
find $PLAYER_DIR -type f | xargs -I{} jq -r '. | .accountid, .displayname' {} | grep -iEB 1 ".*${NAME}.*"
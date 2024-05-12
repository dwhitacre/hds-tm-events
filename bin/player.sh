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
  echo "  $0 <account-id>"
  exit 1
}

ACCOUNT_ID=$1
if [ -z "$ACCOUNT_ID" ]; then
  _usage
fi

response=$(curl -s --fail -H 'User-Agent: hdweeklyleague.com / hdstmevents@whitacre.dev' https://trackmania.io/api/player/$ACCOUNT_ID)

if [ -z "$response" ]; then
  echo "failed to get response from trackmania.io"
  exit 1
fi

echo $response > "$PLAYER_DIR/$ACCOUNT_ID"
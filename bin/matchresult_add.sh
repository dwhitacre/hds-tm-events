#!/usr/bin/env bash

REPO_ROOT=$(git rev-parse --show-toplevel)

function _usage {
  echo "Usage:"
  echo "  $0 <match-id> <account-id> <score>"
  exit 1
}

MATCH_ID=$1
if [ -z "$MATCH_ID" ]; then
  _usage
fi

ACCOUNT_ID=$2
if [ -z "$ACCOUNT_ID" ]; then
  _usage
fi

SCORE=$3
if [ -z "$SCORE" ]; then
  _usage
fi

curl -v -H "x-hdstmevents-adminkey: $HDSTMEVENTS_ADMINKEY" "$HDSTMEVENTS_HOST/api/match/$MATCH_ID/matchresult" -XPUT -d "{\"accountId\": \"$ACCOUNT_ID\", \"score\": $SCORE }"

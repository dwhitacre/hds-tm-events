package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func MatchHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var match domain.Match
	match.MatchId = id
	err := domain.MatchGet(&match)

	if err != nil {
		logger.Warn("No match found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Match found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(match)
}

func MatchResultHandler(w http.ResponseWriter, r *http.Request) {
	matchId := r.PathValue("matchId")
	
	var match domain.Match
	match.MatchId = matchId
	err := domain.MatchGet(&match)
	
	if err != nil {
		logger.Warn("No match found with matchId", "matchId", matchId, "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var matchResult domain.MatchResultData
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&matchResult); err != nil {
		logger.Warn("Failed to parse matchResult", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if matchResult.AccountId == "" {
		logger.Warn("Missing accountId")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodPut {
		err := domain.MatchResultAdd(matchId, matchResult.AccountId, matchResult.Score)
		if err != nil {
			logger.Error("Failed to add matchResult", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	} else if r.Method == http.MethodPost {
		err := domain.MatchResultUpdate(matchId, matchResult.AccountId, matchResult.Score)
		if err != nil {
			logger.Error("Failed to update matchResult", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	} else if r.Method == http.MethodDelete {
		err := domain.MatchResultDelete(matchId, matchResult.AccountId)
		if err != nil {
			logger.Error("Failed to delete matchResult", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}
			
	w.WriteHeader(http.StatusOK)
	return
}

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
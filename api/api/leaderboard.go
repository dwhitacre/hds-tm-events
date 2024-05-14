package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var leaderboard domain.Leaderboard
	leaderboard.LeaderboardId = id
	err := domain.LeaderboardGet(&leaderboard)
	if err != nil {
		logger.Warn("No leaderboard found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Leaderboard found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
	"os"
)

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	
	file, err := os.Open("leaderboard/" + id)
	defer file.Close()

	if err != nil {
		logger.Warn("No leaderboard found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	var leaderboard domain.Leaderboard

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(&leaderboard); err != nil {
		logger.Warn("Leaderboard didnt decode", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Leaderboard found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
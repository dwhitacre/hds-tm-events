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
	
	if err != nil {
		logger.Warn("No leaderboard found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	defer file.Close()

	var leaderboard domain.Leaderboard

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(&leaderboard); err != nil {
		logger.Warn("Leaderboard didnt decode", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Leaderboard found", "id", id)

	for i := 0; i < len(leaderboard.Tops); i++ {
		err = domain.PlayerGet(&leaderboard.Tops[i].Player)
		if err != nil {
			logger.Warn("Failed to hydrate player", "player", leaderboard.Tops[i].Player)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}
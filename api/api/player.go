package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func PlayerHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var player domain.Player
	player.AccountId = id
	err := domain.PlayerGet(&player)

	if err != nil {
		logger.Warn("No player found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Player found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(player)
}
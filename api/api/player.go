package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func PlayerHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	player, err := domain.PlayerGet(id)

	if err != nil {
		logger.Warn("No player found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Player found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(*player)
}
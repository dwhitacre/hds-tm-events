package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func PlayerHandler(w http.ResponseWriter, r *http.Request) {
	if (r.Method == http.MethodPost || r.Method == http.MethodPut) {
		var player *domain.Player

		jsonParser := json.NewDecoder(r.Body)
		if err := jsonParser.Decode(&player); err != nil {
			logger.Warn("Player didnt decode", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var err error
		if r.Method == http.MethodPut {
			err, player = domain.PlayerAdd(db, player)
		} else {
			err, player = domain.PlayerUpdate(db, player)
		}

		if err != nil {
			logger.Warn("Failed to add or update player", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		logger.Info("Player added/updated")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(player)
		return
	}

	err, players := domain.PlayerList(db)
	if err != nil {
		logger.Error("Failed to list players", "err", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	logger.Info("Players found")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}
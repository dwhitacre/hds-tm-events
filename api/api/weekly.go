package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func WeeklyHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var weekly domain.Weekly
	weekly.WeeklyId = id
	err := domain.WeeklyGet(&weekly)

	if err != nil {
		logger.Warn("No weekly found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Weekly found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weekly)
}
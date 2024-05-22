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

func CreateWeeklyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var weekly domain.Weekly
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&weekly); err != nil {
		logger.Warn("Failed to parse weekly", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := domain.WeeklyAdd(&weekly)
	if err != nil {
		logger.Warn("Failed to create weekly", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	logger.Info("Created weekly", "id", weekly.WeeklyId)
	w.WriteHeader(http.StatusCreated)
}
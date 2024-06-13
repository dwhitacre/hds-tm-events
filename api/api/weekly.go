package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

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
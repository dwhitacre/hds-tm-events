package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func WeeklyHandler(w http.ResponseWriter, r *http.Request) {
	if (r.Method == http.MethodPost || r.Method == http.MethodPut) {
		var weekly *domain.Weekly

		jsonParser := json.NewDecoder(r.Body)
		if err := jsonParser.Decode(&weekly); err != nil {
			logger.Warn("Weekly didnt decode", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var err error
		if r.Method == http.MethodPut {
			err, weekly = domain.WeeklyAdd(db, weekly)
		} else {
			err, weekly = domain.WeeklyUpdate(db, weekly)
		}

		if err != nil {
			logger.Warn("Failed to add or update Weekly", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		logger.Info("Weekly added/updated")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(weekly)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
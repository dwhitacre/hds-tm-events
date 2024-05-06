package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func MatchHandler(w http.ResponseWriter, r *http.Request) {
	if (r.Method == http.MethodPost || r.Method == http.MethodPut) {
		var match *domain.Match

		jsonParser := json.NewDecoder(r.Body)
		if err := jsonParser.Decode(&match); err != nil {
			logger.Warn("Match didnt decode", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var err error
		if r.Method == http.MethodPut {
			err, match = domain.MatchAdd(db, match)
		} else {
			err, match = domain.MatchUpdate(db, match)
		}

		if err != nil {
			logger.Warn("Failed to add or update match", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		logger.Info("Match added/updated")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(match)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
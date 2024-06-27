package api

import (
	"encoding/json"
	"hdstmevents-api/domain"
	"net/http"
)

func MapHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var m domain.Map
	m.MapUid = id
	err := domain.MapGet(&m)

	if err != nil {
		logger.Warn("No map found with id", "id", id, "err", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	logger.Info("Map found", "id", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

func CreateMapHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var m domain.Map
	jsonParser := json.NewDecoder(r.Body)
	if err := jsonParser.Decode(&m); err != nil {
		logger.Warn("Failed to parse map", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := domain.MapAdd(&m)
	if err != nil {
		logger.Warn("Failed to add map", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	logger.Info("Added map", "mapUid", m.MapUid)
	w.WriteHeader(http.StatusCreated)
}
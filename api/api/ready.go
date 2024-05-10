package api

import (
	"net/http"
)

func ReadyHandler(w http.ResponseWriter, r *http.Request) {
	logger.Debug("Ready")
	w.WriteHeader(http.StatusOK)
}
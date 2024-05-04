package api

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ReadyHandler(logger *slog.Logger, db *pgxpool.Pool) func (w http.ResponseWriter, r *http.Request) {
	return func (w http.ResponseWriter, r *http.Request) {
		logger.Debug("Ready")
		err := db.Ping(context.Background())
		if err != nil {
			logger.Error("DB connection failed", err)
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
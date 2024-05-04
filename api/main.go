package main

import (
	"context"
	"hdstmevents-api/api"
	"log/slog"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_CONNSTR"))
	if err != nil {
		logger.Error("Unable to create connection pool", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	api.Setup(logger, dbpool)
	http.HandleFunc("/ready", api.ReadyHandler)
	http.HandleFunc("/api/leaderboard/{id}", api.LeaderboardHandler)
	http.HandleFunc("/api/player", api.PlayerHandler)

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(":8081", nil))
}
package main

import (
	"hdstmevents-api/api"
	"log/slog"
	"net/http"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	api.Setup(logger)
	http.HandleFunc("/ready", api.ReadyHandler)
	http.HandleFunc("/api/leaderboard/{id}", api.LeaderboardHandler)
	http.HandleFunc("/api/player/{id}", api.PlayerHandler)

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(":8081", nil))
}
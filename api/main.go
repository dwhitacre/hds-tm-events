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
	http.HandleFunc("/api/match/{id}", api.MatchHandler)
	http.HandleFunc("/api/weekly/{id}", api.WeeklyHandler)

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(os.Getenv("HOST") + ":8081", nil))
}
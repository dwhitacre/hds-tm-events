package main

import (
	"context"
	"hdstmevents-api/api"
	"hdstmevents-api/domain"
	"log/slog"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_CONNSTR"))
	if err != nil {
		logger.Error("Unable to connect to database", err)
		os.Exit(1)
	}
	defer pool.Close()

	domain.Setup(logger, pool)
	api.Setup(logger, pool)
	http.HandleFunc("/ready", api.ReadyHandler)
	http.HandleFunc("/api/leaderboard/{id}", api.LeaderboardHandler)
	http.HandleFunc("/api/leaderboard", api.AdminMiddleware(api.PatchLeaderboardHandler))
	http.HandleFunc("/api/player/{id}", api.PlayerHandler)
	http.HandleFunc("/api/match/{id}", api.MatchHandler)
	http.HandleFunc("/api/weekly/{id}", api.WeeklyHandler)
	http.HandleFunc("/api/weekly", api.AdminMiddleware(api.CreateWeeklyHandler))
	http.HandleFunc("/api/admin", api.AdminMiddleware(api.AdminHandler))

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(os.Getenv("HOST") + ":8081", nil))
}
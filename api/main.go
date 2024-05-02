package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
)

type Player struct {
	Name string `json:"name"`
	Image string `json:"image"`
}

type Top struct {
	Position int `json:"position"`
	Score int `json:"score"`
	Player Player `json:"player"`
}

type Leaderboard struct {
	Tops []Top `json:"tops"`
	Playercount int `json:"playercount"`
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	http.HandleFunc("/leaderboard/{id}", func (w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		
		file, err := os.Open("leaderboard/" + id)
		defer file.Close()

		if err != nil {
			logger.Warn("No leaderboard found with id", "id", id, "err", err)
			w.WriteHeader(http.StatusNoContent)
			return
		}

		var leaderboard Leaderboard

		jsonParser := json.NewDecoder(file)
    if err = jsonParser.Decode(&leaderboard); err != nil {
      logger.Warn("Leaderboard didnt decode", "id", id, "err", err)
			w.WriteHeader(http.StatusNoContent)
			return
    }

		logger.Info("Leaderboard found", "id", id)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(leaderboard)
	})

	logger.Info("Server started")
	logger.Error("Server exited", http.ListenAndServe(":8080", nil))
}
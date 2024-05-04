package api

import (
	"context"
	"encoding/json"
	"errors"
	"hdstmevents-api/domain"
	"net/http"

	"github.com/jackc/pgx/v5"
)

func list() (error, *[]domain.Player) {
	players := make([]domain.Player, 0)
	
	rows, err := db.Query(context.Background(), `select id, name, image from player`)
	if err != nil {
		return err, nil
	}
	
	players, err = pgx.CollectRows(rows, pgx.RowToStructByName[domain.Player])
	if err != nil {
		return err, nil
	}

	return nil, &players
}

func add(player *domain.Player) (error, *domain.Player) {
	result, err := db.Exec(
		context.Background(),
		`insert into player (name, image) values ($1, $2)`,
		player.Name,
		player.Image,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("Rows affected not 1"), nil
	}

	return nil, player
}

func update(player *domain.Player) (error, *domain.Player) {
	result, err := db.Exec(
		context.Background(),
		`update player set name=$1, image=$2 where id=$3`,
		player.Name,
		player.Image,
		player.Id,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("Rows affected not 1"), nil
	}

	return nil, player
}

func PlayerHandler(w http.ResponseWriter, r *http.Request) {
	if (r.Method == http.MethodPost || r.Method == http.MethodPut) {
		var player *domain.Player
		
		jsonParser := json.NewDecoder(r.Body)
		if err := jsonParser.Decode(&player); err != nil {
			logger.Warn("Player didnt decode", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var err error
		if r.Method == http.MethodPut {
			err, player = add(player)
		} else {
			err, player = update(player)
		}

		if err != nil {
			logger.Error("Falied to add or update player", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		logger.Info("Player added/updated")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(player)
		return
	}
	
	err, players := list()
	if err != nil {
		logger.Error("Failed to list players", "err", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	logger.Info("Players found")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}
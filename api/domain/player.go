package domain

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Player struct {
	Id        int        `json:"id"`
	AccountId string     `json:"accountId"`
	Name      string     `json:"name"`
	Image   	string 		 `json:"image"`
	Twitch  	string     `json:"twitch"`
	Discord 	string     `json:"discord"`
}

func PlayerGet(db *pgxpool.Pool, id int) (error, *Player) {
	var player *Player
	row := db.QueryRow(context.Background(), `select id, accountid, name, image, twitch, discord from player where id=$1`, id)

	err := row.Scan(&player)
	if err != nil {
		return err, nil
	}

	return nil, player
}

func PlayerList(db *pgxpool.Pool) (error, *[]Player) {
	rows, err := db.Query(context.Background(), `select id, accountid, name, image, twitch, discord from player`)
	if err != nil {
		return err, nil
	}
	
	var players []Player
	players, err = pgx.CollectRows(rows, pgx.RowToStructByName[Player])
	if err != nil {
		return err, nil
	}

	return nil, &players
}

func PlayerAdd(db *pgxpool.Pool, player *Player) (error, *Player) {
	row := db.QueryRow(
		context.Background(),
		`insert into player (accountid, name, image, twitch, discord) values ($1, $2, $3, $4, $5) returning id, accountid, name, image, twitch, discord`,
		player.AccountId,
		player.Name,
		player.Image,
		player.Twitch,
		player.Discord,
	)

	err := row.Scan(&player)
	if err != nil {
		return err, nil
	}

	return nil, player
}

func PlayerUpdate(db *pgxpool.Pool, player *Player) (error, *Player) {
	result, err := db.Exec(
		context.Background(),
		`update player set accountid=$2, name=$3, image=$4, twitch=$5, discord=$6 where id=$1`,
		player.Id,
		player.AccountId,
		player.Name,
		player.Image,
		player.Twitch,
		player.Discord,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, player
}


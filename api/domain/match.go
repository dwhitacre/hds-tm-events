package domain

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Match struct {
	Id    int        `json:"id"`
	Name 	string     `json:"name"`
}

type MatchPlayer struct {
	Id int `json:"id"`
	MatchFk int `json:"matchFk"`
	PlayerFk int `json:"playerFk"`
	Score int `json:"score"`
}

func MatchGet(db *pgxpool.Pool, id int) (error, *Match) {
	var match *Match
	row := db.QueryRow(context.Background(), `select id, name from match where id=$1`, id)

	err := row.Scan(&match)
	if err != nil {
		return err, nil
	}

	return nil, match
}

func MatchAdd(db *pgxpool.Pool, match *Match) (error, *Match) {
	row := db.QueryRow(
		context.Background(),
		`insert into match (name) values ($1) returning id, name`,
		match.Name,
	)

	err := row.Scan(&match)
	if err != nil {
		return err, nil
	}

	return nil, match
}

func MatchUpdate(db *pgxpool.Pool, match *Match) (error, *Match) {
	result, err := db.Exec(
		context.Background(),
		`update match set name=$2 where id=$1`,
		match.Id,
		match.Name,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, match
}

func MatchAddPlayer(db *pgxpool.Pool, matchPlayer *MatchPlayer) (error, *MatchPlayer) {
	row := db.QueryRow(
		context.Background(),
		`insert into matchplayer (matchfk, playerfk) values ($1, $2) returning id, matchfk, playerfk, score`,
		matchPlayer.MatchFk,
		matchPlayer.PlayerFk,
	)

	err := row.Scan(&matchPlayer)
	if err != nil {
		return err, nil
	}

	return nil, matchPlayer
}

func MatchUpdatePlayer(db *pgxpool.Pool, matchPlayer *MatchPlayer) (error, *MatchPlayer) {
	result, err := db.Exec(
		context.Background(),
		`update matchplayer set score=$2 where id=$1`,
		matchPlayer.Id,
		matchPlayer.Score,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, matchPlayer
}

func MatchRemovePlayer(db *pgxpool.Pool, matchPlayer *MatchPlayer) (error, *MatchPlayer) {
	result, err := db.Exec(
		context.Background(),
		`delete from matchplayer where id=$1`,
		matchPlayer.Id,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, matchPlayer
}
package domain

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Weekly struct {
	Id    int        `json:"id"`
	Name 	string     `json:"name"`
}

type WeeklyMatch struct {
	Id int `json:"id"`
	WeeklyFk int `json:"weeklyFk"`
	MatchFk int `json:"matchFk"`
}

func WeeklyGet(db *pgxpool.Pool, id int) (error, *Weekly) {
	var weekly *Weekly
	row := db.QueryRow(context.Background(), `select id, name from weekly where id=$1`, id)

	err := row.Scan(&weekly)
	if err != nil {
		return err, nil
	}

	return nil, weekly
}

func WeeklyAdd(db *pgxpool.Pool, weekly *Weekly) (error, *Weekly) {
	result, err := db.Exec(
		context.Background(),
		`insert into weekly (name) values ($1)`,
		weekly.Name,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, weekly
}

func WeeklyUpdate(db *pgxpool.Pool, weekly *Weekly) (error, *Weekly) {
	result, err := db.Exec(
		context.Background(),
		`update match set name=$2 where id=$1`,
		weekly.Id,
		weekly.Name,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, weekly
}

func WeeklyRemove(db *pgxpool.Pool, weekly *Weekly) (error, *Weekly) {
	result, err := db.Exec(
		context.Background(),
		`delete from match where id=$1`,
		weekly.Id,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, weekly
}

func WeeklyAddMatch(db *pgxpool.Pool, weeklyMatch *WeeklyMatch) (error, *WeeklyMatch) {
	result, err := db.Exec(
		context.Background(),
		`insert into weeklyMatch (weeklyfk, matchfk) values ($1, $2)`,
		weeklyMatch.WeeklyFk,
		weeklyMatch.MatchFk,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, weeklyMatch
}

func WeeklyRemoveMatch(db *pgxpool.Pool, weeklyMatch *WeeklyMatch) (error, *WeeklyMatch) {
	result, err := db.Exec(
		context.Background(),
		`delete from weeklyMatch where id=$1`,
		weeklyMatch.Id,
	)

	if err != nil {
		return err, nil
	}

	if (result.RowsAffected() != 1) {
		return errors.New("rows affected not 1"), nil
	}

	return nil, weeklyMatch
}
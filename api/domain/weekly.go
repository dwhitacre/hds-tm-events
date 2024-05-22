package domain

import (
	"context"
	"errors"
	"slices"

	"github.com/jackc/pgx/v5"
)

type Weekly struct {
	WeeklyId  string 					`json:"weeklyId"`
	Matches   []*WeeklyMatch 	`json:"matches"`
	Results 	[]*WeeklyResult `json:"results"`
}

type WeeklyMatch struct {
	Match *Match `json:"match"`
}

type WeeklyResult struct {
	Player 		*Player `json:"player"`
	Score 		int 		`json:"score"`
	Position 	int			`json:"position"`
}

type WeeklyData struct {
	WeeklyId string
	MatchId string
}

func getWeeklyData(weeklyId string) ([]WeeklyData, error) {
	var weeklyData []WeeklyData

	rows, err := db.Query(
		context.Background(),
		`select w.WeeklyId, wm.MatchId
			from Weekly w
			join WeeklyMatch wm on w.WeeklyId = wm.WeeklyId
			where w.WeeklyId=$1`,
		weeklyId,
	)
	if err != nil {
		return weeklyData, err
	}

	weeklyData, err = pgx.CollectRows(rows, pgx.RowToStructByName[WeeklyData])
	if err != nil {
		return weeklyData, err
	}

	return weeklyData, nil
}

func toWeekly(weeklyData []WeeklyData, weekly *Weekly) error {
	if len(weeklyData) < 1 {
		return errors.New("WeeklyGet: no weeklyData to create weekly from")
	}

	weekly.WeeklyId = weeklyData[0].WeeklyId

	for i := 0; i < len(weeklyData); i++ {
		var match Match
		match.MatchId = weeklyData[i].MatchId
		err := MatchGet(&match)
		if err != nil {
			return err
		}

		var weeklyMatch WeeklyMatch
		weeklyMatch.Match = &match
		weekly.Matches = append(weekly.Matches, &weeklyMatch)

		for j := 0; j < len(weekly.Matches[i].Match.PointsResults); j++ {
			idx := slices.IndexFunc(weekly.Results, func (weeklyResult *WeeklyResult) bool {
				return weeklyResult.Player.AccountId == weekly.Matches[i].Match.PointsResults[j].Player.AccountId
			})
			if idx == -1 {
				var weeklyResult WeeklyResult
				weeklyResult.Player = weekly.Matches[i].Match.PointsResults[j].Player
				idx = len(weekly.Results)
				weekly.Results = append(weekly.Results, &weeklyResult)
			}
			weekly.Results[idx].Score += weekly.Matches[i].Match.PointsResults[j].Score
		}
	}

	return nil
}

func WeeklyGet(weekly *Weekly) error {
	if weekly.WeeklyId == "" {
		return errors.New("WeeklyGet: missing weekly id, nothing to gets")
	}

	weeklyData, err := getWeeklyData(weekly.WeeklyId)
	if err != nil {
		return err
	}

	err = toWeekly(weeklyData, weekly)
	if err != nil {
		return err
	}

	slices.SortFunc(weekly.Results, func (weeklyResultA *WeeklyResult, weeklyResultB *WeeklyResult) int {
		return weeklyResultB.Score - weeklyResultA.Score
	})

	for i := 0; i < len(weekly.Results); i++ {
		if i > 0 && weekly.Results[i].Score == weekly.Results[i-1].Score {
			weekly.Results[i].Position = weekly.Results[i-1].Position
		} else {
			weekly.Results[i].Position = i + 1
		}
	}

	return nil
}

func WeeklyAdd(weekly *Weekly) error {
	if weekly.WeeklyId == "" {
		return errors.New("WeeklyGet: missing weekly id, nothing to create")
	}

	_, err := db.Exec(
		context.Background(),
		`insert into weekly (WeeklyId) values ($1)`,
		weekly.WeeklyId,
	)
	if err != nil {
		return err
	}

	return nil
}

package domain

import (
	"encoding/json"
	"errors"
	"os"
	"slices"
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
	Player 	*Player `json:"player"`
	Score 	int 		`json:"score"`
}

func WeeklyGet(weekly *Weekly) error {
	if weekly.WeeklyId == "" {
		return errors.New("WeeklyGet: missing weekly id, nothing to gets")
	}

	file, err := os.Open("weekly/" + weekly.WeeklyId)
	
	if err != nil {
		return err
	}
	defer file.Close()

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(weekly); err != nil {
		return err
	}

	for i := 0; i < len(weekly.Matches); i++ {
		err = MatchGet(weekly.Matches[i].Match)
		if err != nil {
			return err
		}

		for j := 0; j < len(weekly.Matches[i].Match.PointsResults); j++ {
			idx := slices.IndexFunc(weekly.Results, func (weeklyResult *WeeklyResult) bool {
				return weeklyResult.Player.AccountId == weekly.Matches[i].Match.PointsResults[j].Player.AccountId
			})
			if idx == -1 {
				weeklyResult := &WeeklyResult{}
				weeklyResult.Player = weekly.Matches[i].Match.PointsResults[j].Player
				idx = len(weekly.Results)
				weekly.Results = append(weekly.Results, weeklyResult)
			}
			weekly.Results[idx].Score += weekly.Matches[i].Match.PointsResults[j].Score
		}
	}

	slices.SortFunc(weekly.Results, func (weeklyResultA *WeeklyResult, weeklyResultB *WeeklyResult) int {
		return weeklyResultB.Score - weeklyResultA.Score
	})

	return nil
}

package domain

import (
	"encoding/json"
	"errors"
	"os"
	"slices"
)

type Match struct {
	MatchId   			string 					`json:"matchId"`
	Results   			[]*MatchResult 	`json:"results"`
	PlayersAwarded 	int 						`json:"playersAwarded"`
	PointsAwarded 	int 						`json:"pointsAwarded"`
	PointsResults		[]*MatchResult	`json:"pointsResults"`
}

type MatchResult struct {
	Player 	*Player `json:"player"`
	Score 	int 		`json:"score"`
}

func MatchGet(match *Match) error {
	if match.MatchId == "" {
		return errors.New("MatchGet: missing match id, nothing to gets")
	}

	file, err := os.Open("match/" + match.MatchId)
	
	if err != nil {
		return err
	}
	defer file.Close()

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(match); err != nil {
		return err
	}

	slices.SortFunc(match.Results, func (matchResultA *MatchResult, matchResultB *MatchResult) int {
		return matchResultB.Score - matchResultA.Score
	})
	
	for i := 0; i < len(match.Results); i++ {
		err = PlayerGet(match.Results[i].Player)
		if err != nil {
			return err
		}

		matchResult := &MatchResult{}
		matchResult.Player = match.Results[i].Player
		if i < match.PlayersAwarded {
			matchResult.Score = match.PointsAwarded
		}
		match.PointsResults = append(match.PointsResults, matchResult)
	}

	return nil
}

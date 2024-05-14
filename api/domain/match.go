package domain

import (
	"encoding/json"
	"errors"
	"os"
)

type Match struct {
	MatchId   			string 					`json:"matchId"`
	Results   			[]*MatchResult 	`json:"results"`
	PlayersAwarded 	int 						`json:"playersAwarded"`
	PointsAwarded 	int 						`json:"pointsAwarded"`
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

	for i := 0; i < len(match.Results); i++ {
		err = PlayerGet(match.Results[i].Player)
		if err != nil {
			return err
		}
	}

	return nil
}

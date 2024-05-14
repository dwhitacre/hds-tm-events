package domain

import (
	"encoding/json"
	"errors"
	"os"
)

type Weekly struct {
	WeeklyId  string 					`json:"weeklyId"`
	Matches   []*WeeklyMatch 	`json:"matches"`
}

type WeeklyMatch struct {
	Match *Match `json:"match"`
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
	}

	return nil
}

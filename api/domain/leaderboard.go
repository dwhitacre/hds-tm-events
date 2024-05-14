package domain

import (
	"encoding/json"
	"errors"
	"os"
)

type Leaderboard struct {
	LeaderboardId string 		`json:"leaderboardId"`
	Tops        	[]*Top 		`json:"tops"`
	Playercount 	int   		`json:"playercount"`
	Weeklies			[]*LeaderboardWeekly `json:"weeklies"`
}

type LeaderboardWeekly struct {
	Weekly *Weekly `json:"weekly"`
}

func LeaderboardGet(leaderboard *Leaderboard) error {
	if leaderboard.LeaderboardId == "" {
		return errors.New("LeaderboardGet: missing leaderboardId, nothing to gets")
	}

	file, err := os.Open("leaderboard/" + leaderboard.LeaderboardId)

	if err != nil {
		return err
	}
	defer file.Close()

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(leaderboard); err != nil {
		return err
	}

	for i := 0; i < len(leaderboard.Tops); i++ {
		err = PlayerGet(leaderboard.Tops[i].Player)
		if err != nil {
			return err
		}
		leaderboard.Playercount++
	}

	for i := 0; i < len(leaderboard.Weeklies); i++ {
		err = WeeklyGet(leaderboard.Weeklies[i].Weekly)
		if err != nil {
			return err
		}
	}

	return nil
}

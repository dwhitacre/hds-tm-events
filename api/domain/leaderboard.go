package domain

import (
	"encoding/json"
	"errors"
	"os"
	"slices"
	"strings"
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

type Top struct {
	Player   *Player `json:"player"`
	Score    int     `json:"score"`
	Position int     `json:"position"`
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

	for i := 0; i < len(leaderboard.Weeklies); i++ {
		err = WeeklyGet(leaderboard.Weeklies[i].Weekly)
		if err != nil {
			return err
		}

		for j := 0; j < len(leaderboard.Weeklies[i].Weekly.Results); j++ {
			idx := slices.IndexFunc(leaderboard.Tops, func (top *Top) bool {
				return top.Player.AccountId == leaderboard.Weeklies[i].Weekly.Results[j].Player.AccountId
			})
			if idx == -1 {
				top := &Top{}
				top.Player = leaderboard.Weeklies[i].Weekly.Results[j].Player
				idx = len(leaderboard.Tops)
				leaderboard.Tops = append(leaderboard.Tops, top)
			}
			leaderboard.Tops[idx].Score += leaderboard.Weeklies[i].Weekly.Results[j].Score
		}
	}

	slices.SortFunc(leaderboard.Tops, func (topA *Top, topB *Top) int {
		if topB.Score == topA.Score {
			return strings.Compare(strings.ToLower(topA.Player.Name), strings.ToLower(topB.Player.Name))
		}
		return topB.Score - topA.Score
	})

	for i := 0; i < len(leaderboard.Tops); i++ {
		if i > 0 && leaderboard.Tops[i].Score == leaderboard.Tops[i-1].Score {
			leaderboard.Tops[i].Position = leaderboard.Tops[i-1].Position
		} else {
			leaderboard.Tops[i].Position = i + 1
		}
		leaderboard.Playercount++
	}

	return nil
}

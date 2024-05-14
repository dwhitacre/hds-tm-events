package domain

import (
	"encoding/json"
	"errors"
	"os"
)

type Player struct {
	Id        int    `json:"id"`
	AccountId string `json:"accountId"`
	Name      string `json:"name"`
	Image     string `json:"image"`
	Twitch    string `json:"twitch"`
	Discord   string `json:"discord"`
}

type PlayerData struct {
	AccountId string `json:"accountId"`
	DisplayName string `json:"displayname"`
	Trophies *PlayerDataTrophy `json:"trophies"`
}

type PlayerDataTrophy struct {
	Zone *PlayerDataZone `json:"zone"`
}

type PlayerDataZone struct {
	Name string `json:"name"`
	Flag string `json:"flag"`
	Parent *PlayerDataZone `json:"parent"`
}

func toPlayer(playerData *PlayerData, player *Player) error {
	player.AccountId = playerData.AccountId
	player.Name = playerData.DisplayName

	if player.Image == "" {
		flag := playerData.Trophies.Zone.Flag
		if len(flag) > 3 {
			flag = playerData.Trophies.Zone.Parent.Flag
			if len(flag) > 3 {
				flag = playerData.Trophies.Zone.Parent.Parent.Flag
			}
		}
		
		player.Image = "assets/images/" + flag + ".jpg"
	}

	return nil
}

func applyPlayerOverrides(player *Player) error {
	file, err := os.Open("player.overrides/" + player.AccountId)

	if err != nil {
		return nil
	}
	defer file.Close()

	var playerOverrides Player

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(&playerOverrides); err != nil {
		return err
	}

	if playerOverrides.Image != "" {
		player.Image = playerOverrides.Image
	}

	return nil
}

func PlayerGet(player *Player) error {
	if player.AccountId == "" {
		return errors.New("missing account id, nothing to gets")
	}

	file, err := os.Open("player/" + player.AccountId)
	
	if err != nil {
		return err
	}
	defer file.Close()

	var playerData PlayerData

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(&playerData); err != nil {
		return err
	}

	if err = toPlayer(&playerData, player); err != nil {
		return err
	}

	if err = applyPlayerOverrides(player); err != nil {
		return err
	}

	return nil
}

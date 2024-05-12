package domain

import (
	"encoding/json"
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

func ToPlayer(playerData *PlayerData, player *Player) error {
	player.AccountId = playerData.AccountId
	player.Name = playerData.DisplayName
	player.Image = "assets/images/" + playerData.Trophies.Zone.Parent.Flag + ".jpg"

	return nil
}

func PlayerGet(accountId string) (*Player, error) {
	file, err := os.Open("player/" + accountId)
	
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var playerData PlayerData

	jsonParser := json.NewDecoder(file)
	if err = jsonParser.Decode(&playerData); err != nil {
		return nil, err
	}

	var player Player
	if err = ToPlayer(&playerData, &player); err != nil {
		return nil, err
	}

	return &player, nil
}
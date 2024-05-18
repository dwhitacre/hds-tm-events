package domain

import (
	"context"
	"encoding/json"
	"errors"
	"os"

	"github.com/jackc/pgx/v5"
)

type Player struct {
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

func getPlayerOverride(accountId string) (Player, error) {
	var player Player

	rows, err := db.Query(
		context.Background(),
		`select AccountId, Name, Image, Twitch, Discord from PlayerOverrides where AccountId=$1`,
		accountId,
	)
	if err != nil {
		return player, err
	}

	player, err = pgx.CollectOneRow(rows, pgx.RowToStructByName[Player])
	if err != pgx.ErrNoRows && err != nil {
		return player, err
	}

	return player, nil
}

func applyPlayerOverrides(player *Player) error {
	playerOverrides, err := getPlayerOverride(player.AccountId);
	if err != nil {
		return err
	}

	if playerOverrides.Name != "" {
		player.Name = playerOverrides.Name
	}
	if playerOverrides.Image != "" {
		player.Image = playerOverrides.Image
	}
	if playerOverrides.Twitch != "" {
		player.Twitch = playerOverrides.Twitch
	}
	if playerOverrides.Discord != "" {
		player.Discord = playerOverrides.Discord
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

package domain

type Leaderboard struct {
	Tops        []Top `json:"tops"`
	Playercount int   `json:"playercount"`
}
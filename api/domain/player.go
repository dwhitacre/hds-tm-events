package domain

type Player struct {
	Id        int    `json:"id"`
	AccountId string `json:"accountId"`
	Name      string `json:"name"`
	Image     string `json:"image"`
	Twitch    string `json:"twitch"`
	Discord   string `json:"discord"`
}

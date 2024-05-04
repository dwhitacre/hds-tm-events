package domain

type Top struct {
	Position int    `json:"position"`
	Score    int    `json:"score"`
	Player   Player `json:"player"`
}

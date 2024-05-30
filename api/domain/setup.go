package domain

import (
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

var logger *slog.Logger
var db *pgxpool.Pool
var tmio *http.Client

func Setup(l *slog.Logger, p *pgxpool.Pool, t *http.Client) {
	logger = l
	db = p
	tmio = t
}

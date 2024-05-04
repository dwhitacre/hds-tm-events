package api

import (
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

var logger *slog.Logger
var db *pgxpool.Pool

func Setup(l *slog.Logger, d *pgxpool.Pool) {
	logger = l
	db = d
}

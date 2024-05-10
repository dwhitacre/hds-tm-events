package api

import (
	"log/slog"
)

var logger *slog.Logger

func Setup(l *slog.Logger) {
	logger = l
}

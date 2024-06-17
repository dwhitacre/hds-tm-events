package api

import (
	"net/http"
	"strings"
)

func DirectHandler(w http.ResponseWriter, r *http.Request) {
	subdomains := strings.Split(r.Host, ".")

	if subdomains[0] == "join" {
		logger.Info("Redirected to discord")
		http.Redirect(w, r, "https://discord.gg/yR5EtqAWW7", http.StatusFound)
		return
	}

	w.WriteHeader(http.StatusNotFound)
}
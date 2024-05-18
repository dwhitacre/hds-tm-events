FROM golang:1.22 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./
COPY api/*.go ./api/
COPY domain/*.go ./domain/
RUN CGO_ENABLED=0 GOOS=linux go build -o /hdstmevents-api

FROM gcr.io/distroless/base-debian12

WORKDIR /
COPY --from=build /hdstmevents-api /hdstmevents-api
COPY ./leaderboard /leaderboard
COPY ./player /player
COPY ./weekly /weekly

EXPOSE 8080
USER nonroot:nonroot

ENTRYPOINT ["/hdstmevents-api"]
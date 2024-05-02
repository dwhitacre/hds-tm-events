FROM golang:1.22 AS build

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /hdstmevents-api

FROM gcr.io/distroless/base-debian12

WORKDIR /
COPY --from=build /hdstmevents-api /hdstmevents-api
COPY ./leaderboard /leaderboard

EXPOSE 8080
USER nonroot:nonroot

ENTRYPOINT ["/hdstmevents-api"]
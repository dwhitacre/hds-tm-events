/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { leaderboardAddWeekly, leaderboardCreate, leaderboardGet } from "../api/leaderboard"
import { fakeWeeklyId, weeklyCreate } from '../api/weekly'

context('/api/leaderboard', () => {
  it('get leaderboard dne', () => {
    leaderboardGet('000').then(response => {
      expect(response.status).to.eq(204)
    })
  })

  // todo would be better for this to not return 204
  it('get leaderboard with no weeklies', () => {
    const leaderboardId = faker.string.uuid()
    leaderboardCreate({ leaderboardId }).then(() => {
      leaderboardGet(leaderboardId).then(response => {
        expect(response.status).to.eq(204)
      })
    })
  })

  it('add weekly to leaderboard', () => {
    const leaderboardId = faker.string.uuid()
    const weeklyId = fakeWeeklyId()

    leaderboardCreate({ leaderboardId }).then(() => {
      weeklyCreate({ weeklyId }).then(() => {
        leaderboardAddWeekly({ leaderboardId, weeklyId }).then(response => {
          expect(response.status).to.eq(201)
          leaderboardGet(leaderboardId).then(response => {
            expect(response.status).to.eq(200)
            expect(response.body.leaderboardId).to.eq(leaderboardId)
            expect(response.body.tops).to.be.null
            expect(response.body.playercount).to.eq(0)
            expect(response.body.players).to.have.length.gt(0)
            expect(new Date(response.body.lastModified)).above(faker.date.recent()).below(faker.date.soon())

            expect(response.body.weeklies).to.have.length(1)
            expect(response.body.weeklies[0]).to.have.property('weekly')
            expect(response.body.weeklies[0].published).to.be.true
            const weekly = response.body.weeklies[0].weekly
            expect(weekly.weeklyId).to.eq(weeklyId)
            expect(weekly.matches).to.have.length(8)
            expect(weekly.matches).to.deep.include.members([
              {
                match: {
                  matchId: `${weeklyId}-finals`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-semifinal-a`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-semifinal-b`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 5,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-quarterfinal-a`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 4,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-quarterfinal-b`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 4,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-quarterfinal-c`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 4,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-quarterfinal-d`,
                  results: [],
                  playersAwarded: 1,
                  pointsAwarded: 4,
                  pointsResults: []
                },
              }, {
                match: {
                  matchId: `${weeklyId}-qualifying`,
                  results: [],
                  playersAwarded: 8,
                  pointsAwarded: 1,
                  pointsResults: []
                },
              }
            ])
          })
        })
      })
    })
  })
})
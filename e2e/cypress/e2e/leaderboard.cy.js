/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { leaderboardCreate, leaderboardGet } from "../api/leaderboard"

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
})
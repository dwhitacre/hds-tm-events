/// <reference types="cypress" />

import { fakeWeeklyId, weeklyCreate } from "../api/weekly"

context('/api/weekly', () => {
  it('create weekly bad method', () => {
    weeklyCreate({ method: 'POST' }).then(response => {
      expect(response.status).to.eq(405)
    })
  })

  it('create weekly bad body', () => {
    weeklyCreate({
      body: fakeWeeklyId(),
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create weekly no weekly id', () => {
    weeklyCreate({
      body: {},
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create a weekly', () => {
    weeklyCreate().then(response => {
      expect(response.status).to.eq(201)
    })
  })
})
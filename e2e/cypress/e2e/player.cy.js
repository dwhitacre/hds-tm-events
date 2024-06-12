/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

context('/player', () => {
  it('get player dne', () => {
    cy.api({
      url: '/api/player/000'
    }).then(response => {
      expect(response.status).to.eq(204)
    })
  })

  it('create player bad method', () => {
    cy.api({
      url: '/api/player',
      body: {
        accountId: faker.string.uuid()
      },
      method: 'POST',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(405)
    })
  })

  it('create player bad body', () => {
    cy.api({
      url: '/api/player',
      body: faker.string.uuid(),
      method: 'PUT',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player no account id', () => {
    cy.api({
      url: '/api/player',
      body: {},
      method: 'PUT',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio not found', () => {
    cy.api({
      url: '/api/player',
      body: {
        accountId: '404'
      },
      method: 'PUT',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio found no accountid', () => {
    cy.api({
      url: '/api/player',
      body: {
        accountId: '4000'
      },
      method: 'PUT',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })

  it('create player tmio found no displayname', () => {
    cy.api({
      url: '/api/player',
      body: {
        accountId: '4001'
      },
      method: 'PUT',
      failOnStatusCode: false,
      headers: {
        'x-hdstmevents-adminkey': 'developer-test-key'
      }
    }).then(response => {
      expect(response.status).to.eq(400)
    })
  })
})
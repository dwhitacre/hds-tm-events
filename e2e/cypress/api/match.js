export const matchResultAdd = ({ matchId, accountId, body, method = 'PUT' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}

export const matchResultUpdate = ({ matchId, accountId, score = 0, body, method = 'POST' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId, score },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}

export const matchResultDelete = ({ matchId, accountId, body, method = 'DELETE' } = {}) => {
  return cy.api({
    url: `/api/match/${matchId}/matchresult`,
    body: body ?? { accountId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}
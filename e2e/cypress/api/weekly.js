import { faker } from '@faker-js/faker'

export const fakeWeeklyId = () => `${faker.date.anytime().toISOString().split('T')[0]}-${faker.string.alphanumeric(10)}`

export const weeklyCreate = ({ weeklyId = fakeWeeklyId(), body, method = 'PUT' } = {}) => {
  return cy.api({
    url: '/api/weekly',
    body: body ?? { weeklyId },
    method,
    failOnStatusCode: false,
    headers: {
      'x-hdstmevents-adminkey': 'developer-test-key'
    }
  })
}
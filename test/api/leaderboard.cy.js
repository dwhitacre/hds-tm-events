describe('/api/leaderboard/{id}', () => {
  it('should return 204 if dne', () => {
    cy.request({
      url: '/api/leaderboard/dne',
    }).then(response => {
      expect(response.status).to.eq(204)
    })
  })

  it('should return leaderboard if when standings', () => {
    cy.request({
      url: '/api/leaderboard/standings',
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.haveOwnProperty('playercount')
      expect(response.body.playercount).to.be.a('number')
    })
  })
})
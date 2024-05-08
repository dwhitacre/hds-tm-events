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
      expect(response.body.playercount).to.be.a('number')
      expect(response.body).to.haveOwnProperty('tops')
      expect(response.body.tops).to.be.an('array')
      expect(response.body.tops).to.have.length.gt(0)
      expect(response.body.tops[0]).to.haveOwnProperty('player')
      expect(response.body.tops[0].player.name).to.be.a('string')
      expect(response.body.tops[0].position).to.be.a('number')
      expect(response.body.tops[0].score).to.be.a('number')
    })
  })
})
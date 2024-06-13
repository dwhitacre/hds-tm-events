export const leaderboardGet = (leaderboardId) => {
  return cy.api({
    url: `/api/leaderboard/${leaderboardId}`
  })
}

export const leaderboardCreate = (values) => {
  values.lastModified ??= new Date().toISOString()
  return cy.task('db', {
    query: 'insert into Leaderboard (LeaderboardId, LastModified) values (${leaderboardId}, ${lastModified});',
    values,
  })
}

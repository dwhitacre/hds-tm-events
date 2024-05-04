create table top(
  id serial primary key,
  position int not null,
  score int not null,
  player_fk int not null,
  leaderboard_fk int not null,
  foreign key (player_fk) REFERENCES player(id),
  foreign key (leaderboard_fk) REFERENCES leaderboard(id)
);

---- create above / drop below ----

drop table top;
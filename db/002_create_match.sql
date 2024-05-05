create table match(
  id serial primary key,
  name varchar not null
);

create table matchplayer(
  id serial primary key,
  playerfk int not null,
  matchfk int not null,
  score int not null default 0,
  foreign key (playerfk) references player(id),
  foreign key (matchfk) references match(id)
);

---- create above / drop below ----

drop table matchplayer;
drop table match;

create table player(
  id serial primary key,
  accountid varchar not null,
  name varchar not null,
  image varchar not null default '',
  twitch varchar not null default '',
  discord varchar not null default ''
);

---- create above / drop below ----

drop table player;

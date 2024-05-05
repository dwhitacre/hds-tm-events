create table weekly(
  id serial primary key,
  name varchar not null
);

create table weeklymatch(
  id serial primary key,
  weeklyfk int not null,
  matchfk int not null,
  foreign key (weeklyfk) references weekly(id),
  foreign key (matchfk) references match(id)
);

---- create above / drop below ----

drop table weeklymatch;
drop table weekly;

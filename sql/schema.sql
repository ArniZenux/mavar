CREATE TABLE IF NOT EXISTS user(
  id int primary key,
  name varchar(128) not null,
);

CREATE TABLE IF NOT EXISTS project(
  id int primary key,
  des_project varchar(255) not null,
);

CREATE TABLE IF NOT EXISTS works(
  id int primary key,
  staffNr int not null,
  projectNr int not null,
  foreign key (staffNr) references user(id),
  foreign key (projectNr) references project(id)
);
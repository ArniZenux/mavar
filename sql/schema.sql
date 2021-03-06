CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  nameuser varchar(64) not null, 
  username character varying(64) not null,
  password character varying(256) not null,
  admin boolean not null
);

CREATE TABLE IF NOT EXISTS vidburdur (
  id serial primary key,
  namevidburdur varchar(64) not null unique,
  slug varchar(64) not null,
  description varchar(400),
  userid integer not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp,
  constraint userid foreign key (userid) references users (id)  
);

CREATE TABLE IF NOT EXISTS skraning (
  id serial primary key,
  nameskra varchar(64) not null,
  comment varchar(64),
  eventid integer not null, 
  userid integer not null, 
  created timestamp with time zone not null default current_timestamp,
  constraint eventid foreign key (eventid) references vidburdur (id),
  constraint userid foreign key (userid) references users (id)  
);

-- Lykilorð: "123"
INSERT INTO users 
(nameuser, username, password, admin) 
VALUES ('Arni', 
        'admin', 
        '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
        true
      );

-- Lykilorð: "123"
INSERT INTO users 
(nameuser, username, password, admin) 
VALUES ('Anna', 
        'anna', 
        '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
        false
      );

INSERT INTO vidburdur 
(namevidburdur, slug, description, userid ) 
VALUES ('Ski school', 
        'ski-school', 
        'Saturday in Skalfell',
        1
      );

INSERT INTO vidburdur 
(namevidburdur, slug, description, userid ) 
VALUES ('Handball',
        'handball', 
        'Handball school',
        1
      );

INSERT INTO vidburdur 
(namevidburdur, slug, description, userid ) 
VALUES ('NBA school', 
        'nba-school', 
        'To be master!',
        2
      );

INSERT INTO skraning 
(nameskra, comment, eventid, userid ) 
VALUES ('Andri Mars', 
        'I like ski so much', 
        1,
        1
      );

INSERT INTO skraning 
(nameskra, comment, eventid, userid ) 
VALUES ('Arnar Jonas', 
        'I love handball', 
        2,
        1
      );

INSERT INTO skraning
(nameskra, comment, eventid, userid ) 
VALUES ('Micheal Jordan', 
        'I am best player in the world', 
        3,
        2
      );
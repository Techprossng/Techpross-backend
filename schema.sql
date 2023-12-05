CREATE DATABASE IF NOT EXISTS 'database_db';

USE database_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT(60) NOT NULL PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  phone_number VARCHAR(50),
  bio VARCHAR(256),
  country VARCHAR(50),
);

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT(60) NOT NULL PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(256) NOT NULL,
  course_level ENUM('Beginner', 'Advanced') NOT NULL,
  price INT,
  course_id BIGINT(60),
  FOREIGN KEY (id) REFERENCES courses(id)
);

-- modules table - shares a many-to-one relationship with courses table 
CREATE TABLE IF NOT EXISTS modules (
   id BIGINT(60) NOT NULL PRIMARY KEY,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(256) NOT NULL,
  course_id BIGINT(60),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- many-to-many relationship between users and courses
CREATE TABLE IF NOT EXISTS users_courses (
    user_id BIGINT(60) NOT NULL,
    course_id BIGINT(60) NOT NULL,
    `date_enrolled` DATE NOT NULL DEFAULT (CURRENT_DATE()),
    CONSTRAINT user_id_fk
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT course_id_fk
        FOREIGN KEY (course_id) REFERENCES courses(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- shares a one-to-one relationship with courses
CREATE TABLE IF NOT EXISTS instructors (
  id BIGINT(60) NOT NULL PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  name VARCHAR(256) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  course_id BIGINT(60),
  FOREIGN KEY (id) REFERENCES courses(id)
);

-- contacts table; for getting information or booking a session with techpros
CREATE TABLE IF NOT EXISTS contacts (
	id BIGINT(60) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`firstName` VARCHAR(100) NOT NULL,
	`lastName` VARCHAR(100) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
)

-- create index here for tables
CREATE INDEX user_id_index ON users(id);
CREATE INDEX user_email_index ON users(email);

CREATE INDEX instructor_id_index ON instructors(id);
CREATE INDEX instructor_email_index ON instructors(email);

CREATE INDEX course_id_index ON courses(id);
CREATE INDEX instructor_id_index ON courses (instructor_id);

CREATE INDEX module_id_index ON modules(id);
CREATE INDEX course_id_index ON modules(course_id);

CREATE INDEX user_id_index ON users_courses(user_id);

CREATE INDEX contact_id_index ON contacts(id);
CREATE INDEX contact_email_index ON contacts(email);

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;


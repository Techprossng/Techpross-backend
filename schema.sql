CREATE INDEX user_id_index ON users(id);
CREATE INDEX user_email_index ON users(email);

CREATE INDEX instructor_id_index ON instructors(id);
CREATE INDEX instructor_email_index ON instructors(email);

CREATE INDEX course_id_index ON courses(id);
CREATE INDEX instructor_id_index ON courses (instructor_id);

CREATE INDEX module_id_index ON moduless(id);
CREATE INDEX course_id_index ON moduless (course_id);

CREATE INDEX user_id_index ON users_courses (user_id);

# TEAM TASKS 08-11-2023

### Please read each task carefully and indicate the task chosen.

#### Note: Two persons can work on one task.

- Create the migration for the instructors table:
    - The one-to-one relationship must be defined on the `instructors` table. Why? When an instructor is queried, the course_id for the instructor will also be part of the response.
    - The migration must be done using the `npm run db-make-migration create_instrctors_table` command.
    - Inside the instructors migration file created above, make sure the columns are created as defined in the schema.sql` file provided.
    - Include index for the `id` column.
    - Note that you do not have to define the users table inside the file. This will be done separately in another file.
    Reference this link for a walkthrough: [link](https://alexzywiak.github.io/knex-bag-o-functions-modeling-many-to-many-relationships-in-node-2/index.html)

- Create the migration for the `users` and `courses` table defining their many-to-many relationship.
    - The relationship must be defined on the `users_courses` table.
    - Define the one-to-one relationship for the `courses` and `instructors` table on the `courses` table. Why? When a course is queried, the instructor_id for the course will also be part of the response.
    - The migration must be done using the `npm run db-make-migration create_users_courses_table` command.
    - Inside the migration file created above, make sure the columns are created as defined in the schema.sql` file provided.
    - Include index for the `id` and `email` columns.
    Reference this link for a walkthrough: [link](https://alexzywiak.github.io/knex-bag-o-functions-modeling-many-to-many-relationships-in-node-2/index.html)

- Create indices (multiple index) for the database.
    - All `ids` must be indexed.
    - All `email` columns must be indexed.
    - The queries must be written in the `schema.sql` file.

- 
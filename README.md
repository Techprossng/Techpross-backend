# Backend Repository

To set up your node enviroment
- Install node.js
### For windows
It's pretty straightforward.
Please follow this [link](https://nodejs.org/en)
### For linux
Please follow this [link](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)

## Setup and start server
- To begin your server, start by installing all the dependencies:
```
$ npm install
```
- Create a `.env.local` file: This file will serve as your local .env file that will contain all the environment variables for the database and the jsonwebtoken verification secret for development.

- You do not need to run the `npm run db-init` command. The `knexfile.js` has already been created. Only these commands will be of use to you:
    - `npm run db-make-migration migration_name` e.g `npm run db-make-migration create_courses_table`
    - `npm run db-migrate-dev` will update your local database with the latest migrations
    - `npm run db-migrate-up`: To run the specified migration that has not yet been run e.g `npm run db-migrate-up 20231107222319_create_courses_table.js`, assuming it was the last migration you made. Omitting the specified migration also runs the last migration that was made
    - `npm run db-migrate-down`: To undo the last run migration. Like above, the migration file can also be specified.

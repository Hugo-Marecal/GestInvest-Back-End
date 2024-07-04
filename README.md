# GestInvest-back

# README

## Prerequisites

- Node.js
- PostgreSQL

## Installation

1. Clone this repository on your local machine:

   ```bash
   git clone <repo-link>
   ```

2. Go to the project directory:

   ```bash
   cd <project-name>
   ```

3. Install the npm dependencies:

   ```bash
   npm install
   ```

## Database configuration

1. Make sure PostgreSQL is installed and running on your local machine.
2. Create a local PostgreSQL database. You can use the command-line tool `createdb` or a graphical tool like pgAdmin.
3. Once the database has been created, run the SQL deployment script to create the database schema:

   ```bash
   psql -U <user> -d <database-name> -a -f migrations/deploy/createdb.sql
   ```

4. Next, run the seeding script to populate the database with initial data:

   ```bash
   psql -U <user> -d <database-name> -a -f data/seeding.sql
   ```

## Environment configuration

1. Create a `.env` file at the root of the project, based on the `.env.example` file.
2. Fill in all the required environment variables in the `.env` file you've just created.

## Launch server

Once you've installed the dependencies, configured the database and set the environment variables, you can start the server by executing the following command:

```bash
npm run dev
```

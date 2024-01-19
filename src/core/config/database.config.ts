import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD ||  "",
    database: process.env.DATABASE_NAME,
    charset: "utf8mb4"
  }
})

export default db;
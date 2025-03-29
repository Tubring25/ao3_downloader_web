const isDevelopment = process.env.NODE_ENV === "development";
module.exports = {
  schema: "./lib/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: isDevelopment ? "durable-sqlite" : "d1-http",
  dbCredentials: isDevelopment ?
    {
      url: "./local.db"
    } :
    {
      accountId: process.env.ACCOUNT_ID,
      databaseId: process.env.DATABASE_ID,
      token: process.env.D1_TOKEN
    }
};

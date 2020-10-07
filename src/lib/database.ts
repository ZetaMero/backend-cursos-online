import MongoClient from "mongodb";
import chalk from "chalk";

class Database {
  async init() {
    const MONGO_DB =
      process.env.DATABASE ||
      "mongodb+srv://facci:<facciUleam2020>@cluster0.3gxvw.mongodb.net/<dbname>?retryWrites=true&w=majority";

    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();

    if (client.isConnected()) {
      console.log("=====================DATABASE======================");
      console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
      console.log(`DATABASE: ${chalk.greenBright(db.databaseName)}`);
    }
    return db;
  }
}
export default Database;

import MongoDatabase from "../database/MongoDatabase";
import AppFactory from "./factory/AppFactory";

class App extends AppFactory {
  async connectDB(): Promise<void> {
    const mongoDatabase = new MongoDatabase();
    await mongoDatabase.connectDatabase();
  }
}

export default App;

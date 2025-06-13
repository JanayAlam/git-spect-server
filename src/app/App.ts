import AppFactory from "./factory/AppFactory";

class App extends AppFactory {
  async connectDB(): Promise<void> {}
}

export default App;

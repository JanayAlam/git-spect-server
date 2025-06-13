import AppFactory from "./factory/AppFactory";

class TestApp extends AppFactory {
  async connectDB(): Promise<void> {}
}

export default TestApp;

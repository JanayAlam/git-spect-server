class Constant {
  private static instance: Constant = new Constant();

  private constructor() {}

  public static getInstance(): Constant {
    return Constant.instance;
  }
}

export default Constant;

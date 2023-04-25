class HelloWorldCommand {
  constructor() {
    this.name = 'HelloWorld';
    this.description = 'Say hello';
  }

  async run() {
    console.log('Hello, world!');
  }
}

export default HelloWorldCommand;
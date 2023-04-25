class HelloCommand {
    constructor() {
        this.name = 'hello';
        this.description = 'Say hello';
    }

    async run() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Hello, world!');
    }
}

export default HelloCommand;

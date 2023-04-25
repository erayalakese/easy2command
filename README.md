# Easy2Command

> :warning: Only for local use. Lack of basic security checks.

A helper package for creating CLI applications using Commander.js and Inquirer.js.

Easy2Command makes it easy to load and execute commands from a directory of JavaScript files, and automatically creates
an interactive menu for users to choose from.

## Installation

```bash
npm install easy2command
```

## Usage

Create a folder named 'commands' in your project, and add command files with a default exported class. Each command
class should have a 'name', 'description', and a 'run' method. For example:

```javascript
// commands/hello.js
class HelloCommand {
    constructor() {
        this.name = 'hello';
        this.description = 'Say hello';
    }

    async run() {
        console.log('Hello, world!');
    }
}

export default HelloCommand;
```

Then, in your main application file, import the CommandHelper package and use it like this:

```javascript
import CommandHelper from 'commandhelper';

(async () => {
    const commandHelper = new CommandHelper();
    commandHelper.setCommandDir('./commands');
    await commandHelper.registerAllCommands();
    await commandHelper.displayInteractiveMenu();
})();
```

Now, when you run your application, CommandHelper will automatically load all commands from the 'commands' folder and
display an interactive menu for users to choose from.

## License

MIT

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import inquirer from 'inquirer';

class CommandHelper {
    constructor() {
        if (CommandHelper.instance) {
            return CommandHelper.instance;
        }

        this.commands = [];
        CommandHelper.instance = this;
    }

    async setCommandDir(commandDir) {
        this.commandDir = commandDir;
    }

    async loadCommands() {
        const commandFiles = await fs.readdir(this.commandDir);
        const filteredFiles = commandFiles.filter(file => file.endsWith('.js'));

        return Promise.all(filteredFiles.map(async file => {
            const filePath = path.join(".", this.commandDir, file).replace(/\\/g, '/');
            const { default: Command } = await import((`./${filePath}`));
            return new Command();
        }));
    }

    async registerCommand(command) {
        program
            .command(command.name)
            .description(command.description)
            .action(async () => {
                await command.run();
            });
    }

    async registerAllCommands() {
        this.commands = await this.loadCommands();
        await Promise.all(this.commands.map(command => this.registerCommand(command)));
    }

    async createNewCommand(commandName) {
        const commandTemplate = `
class ${commandName}Command {
  constructor() {
    this.name = '${commandName}';
    this.description = 'Say hello';
  }

  async run() {
    console.log('Hello, world!');
  }
}

export default ${commandName}Command;
`;

        const filePath = path.join(this.commandDir, `${commandName}.js`);
        await fs.writeFile(filePath, commandTemplate.trim());
    }

    async displayInteractiveMenu() {
        const choices = this.commands.map(command => ({
            name: `${command.name} - ${command.description}`,
            value: command,
        }));

        choices.push(new inquirer.Separator());
        choices.push({ name: 'Create a new command', value: 'new-command' });

        const { selectedCommand } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCommand',
                message: 'Select a command to execute:',
                choices: choices,
            },
        ]);

        if (selectedCommand === 'new-command') {
            const { commandName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'commandName',
                    message: 'Enter the name for the new command:',
                },
            ]);

            await this.createNewCommand(commandName);
            console.log(`New command "${commandName}" created.`);
            this.commands = await this.loadCommands();
            await this.displayInteractiveMenu();
        } else {
            await selectedCommand.run();
        }
    }
}

export default CommandHelper;

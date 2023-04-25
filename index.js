// index.js
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
            const filePath = path.join(this.commandDir, file);
            const { default: Command } = await import(`file://${filePath}`);
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

    async displayInteractiveMenu() {
        const choices = this.commands.map(command => ({
            name: `${command.name} - ${command.description}`,
            value: command,
        }));

        const { selectedCommand } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCommand',
                message: 'Select a command to execute:',
                choices: choices,
            },
        ]);

        await selectedCommand.run();
    }
}

export default CommandHelper;

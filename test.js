import CommandHelper from "./index.js";

(async () => {
    const commandHelper = new CommandHelper();
    commandHelper.setCommandDir('./commands');
    await commandHelper.registerAllCommands();
    await commandHelper.displayInteractiveMenu();
})();

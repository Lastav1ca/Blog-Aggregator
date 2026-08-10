import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, handlerLogin, handlerRegister, registerCommand, runCommand } from "./commands.js"

async function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);

    const args = process.argv.slice(2);

    if (args.length < 1){
        console.log("Not enough arguments provided.");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try{
        await runCommand(registry, cmdName, ...cmdArgs);
    }catch(err){
        if (err instanceof Error){
            console.log(err.message);
            process.exit(1);
        }
    }
    process.exit(0);
}

main();
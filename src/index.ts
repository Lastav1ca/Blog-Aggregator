import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commands.js"

function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);

    const args = process.argv.slice(2);

    if (args.length < 1){
        console.log("Not enough arguments provided.");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try{
        runCommand(registry, cmdName, ...cmdArgs);
    }catch(err){
        if (err instanceof Error){
            console.log(err.message);
            process.exit(1);
        }
    }
}

main();
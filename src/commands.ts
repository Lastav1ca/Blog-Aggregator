import { setUser } from "./config.js";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName : string, ...args: string[]) {
    if (args.length == 0){
        throw new Error("Missing username");
    }

    setUser(args[0]);

    console.log(`Username: ${args[0]} has been set.`);
}

export function registerCommand(registry : CommandsRegistry, cmdName : string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];

    if(!handler){
        throw new Error("Command doesnt exist");
    }
    handler(cmdName, ...args);
}
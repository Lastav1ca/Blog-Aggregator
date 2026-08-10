import { setUser } from "./config.js";
import { createUser, getUserByName } from "./lib/db/queries/users.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerLogin(cmdName : string, ...args: string[]) {
    if (args.length == 0){
        throw new Error("Missing username");
        process.exit(1);
    }

    const user = await getUserByName(args[0]);

    if(!user){
        throw new Error("User doesnt exist!");
        process.exit(1);
    }

    setUser(args[0]);

    console.log(`Username: ${args[0]} has been set.`);
}

export async function handlerRegister(cmdName : string, ...args: string[]){
    if (args.length == 0){
        throw new Error("Missing username");
    }

    const result = await createUser(args[0]);
    if (!result){
        throw new Error("User already exists");
    }

    setUser(args[0]);

    console.log(`User created successfully.`)
    const user = await getUserByName(args[0]);
    console.log(`Debug: `, user);
}

export function registerCommand(registry : CommandsRegistry, cmdName : string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    const handler = registry[cmdName];

    if(!handler){
        throw new Error("Command doesnt exist");
    }
    await handler(cmdName, ...args);
}
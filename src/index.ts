import { setUser, readConfig } from "./config.js";
import { CommandsRegistry, handlerLogin, handlerRegister, registerCommand, runCommand, handlerReset, handlerUsers, handlerAgg, handlerAddFeed, handlerFeeds, handlerFollow, handlerFollowing, handlerUnfollow } from "./commands.js"

async function main() {
    const registry : CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset)
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow" , handlerFollow);
    registerCommand(registry, "following" , handlerFollowing);
    registerCommand(registry, "unfollow", handlerUnfollow);

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
import { readConfig, setUser } from "./config.js";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feedFollows.js";
import { createFeed, getAllFeeds, getFeedByURL } from "./lib/db/queries/feeds.js";
import { createUser, deleteUsers, getAllUsers, getUserById, getUserByName } from "./lib/db/queries/users.js";
import { fetchFeed } from "./rss.js";

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

export async function handlerReset(cmdName : string, ...args: string[]){
    const result = await deleteUsers();
    console.log('Table reset successfully.')
}

export async function handlerUsers(cmdName : string, ...args: string[]){

    const result = await getAllUsers();

    if (!result){
        console.log("Table is empty");
        return
    }

    const currentUser = readConfig().currentUserName;


    for (const user of result){
        if (currentUser == user.name){
            console.log(`* ${user.name} (current)`)
        }else{
            console.log(`* ${user.name}`)
        }
        
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]){

    const result = await fetchFeed("https://www.wagslane.dev/index.xml");

    if (!result){
        throw new Error("Error fetching website");
        process.exit(1);
    }

    console.log(result);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]){

    if (args.length != 2){
        throw new Error("Invalid command usage. Use: add <feed_name> <url>")
        process.exit(1);
    }

    const currentUserName = readConfig().currentUserName;
    const currentUser = await getUserByName(currentUserName);

    const result = await createFeed(args[0], args[1], currentUser.id);

    if (!result){
        throw new Error("Invalid request");
        process.exit(1);
    }

    console.log(`Feed ${args[0]} created.`)

    const feed = await getFeedByURL(args[1]);

    const res = await createFeedFollow(currentUser.id, feed.id);

    if (!res){
        throw new Error("Error adding feed following");
        process.exit(1);
    }

    console.log(`User ${currentUserName} is now following ${args[0]}`);



}

export async function handlerFeeds(cmdName: string, ...args: string[]){
    const feeds = await getAllFeeds();

    if (!feeds){
        console.log(`There are no feeds`)
        return
    }

    for (const feed of feeds){
        console.log(feed.name);
        console.log(feed.url);

        const user = await getUserById(feed.user_id)
        console.log(user.name);
    }
}

export async function handlerFollow(cmdName: string, ...args: string[]){

    const currentUserName = readConfig().currentUserName;
    const currentUser = await getUserByName(currentUserName);

    if (!args[0]){
        throw new Error(`Invalid command usage! Use: follow <url>`)
        process.exit(1)
    }

    const feed = await getFeedByURL(args[0]);

    const res = await createFeedFollow(currentUser.id, feed.id);


    if(!res){
        throw new Error("Non-existant feed url")
        process.exit(1)
    }

    console.log(feed.name)
    console.log(currentUser.name)
    
}

export async function handlerFollowing(cmdName : string, ...args : string[]){

    const currentUserName = readConfig().currentUserName;
    const currentUser = await getUserByName(currentUserName);

    const feedsFollowing = await getFeedFollowsForUser(currentUser.id);

    for (const feed of feedsFollowing){
        console.log(feed.feedName);
    }
}

export async function handlerUnfollow(cmdName : string, ...args : string[]){

    if (!args[0] || !args[1]){
        throw new Error("Wrong command usage. Use unfollow <user> <feed_url>")
    }

    const user = await getUserByName(args[0]);
    const userId = user.id;

    const unfollow = await deleteFeedFollow(userId, args[1])

    console.log("Feed unfollowed successfully.")
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

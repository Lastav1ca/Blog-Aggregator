import { Feed, User } from "../lib/db/schema.js";

export function printFeed(feed : Feed, user: User){
    console.log(`User: ${user}`)
    console.log(`Feed: ${feed}`)
}
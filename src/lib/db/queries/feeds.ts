import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, users } from "../schema.js";

export async function createFeed(name : string, url : string, user_id: string){
    const [result] = await db.insert(feeds).values({name : name, url : url, user_id: user_id}).returning();
    return result;
}

export async function getAllFeeds(){
    const result = await db.select().from(feeds)
    return result;
}




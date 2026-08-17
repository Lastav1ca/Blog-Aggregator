import { eq, inArray } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, users } from "../schema.js";

export async function createFeedFollow(userId : string, feedId : string){
    const [result] = await db.insert(feedFollows).values({userId: userId, feedId: feedId}).returning();
    return result;
}

export async function getFeedFollowsForUser(userId : string){
    const result = 
    await db
    .select({
        feedName : feeds.name,
        userName : users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

    return result;
}

export async function deleteFeedFollow(userId : string, feedUrl : string){
    const [result] = await db
    .delete(feedFollows)
    .where(
        eq(feedFollows.userId, userId) &&
        inArray(feedFollows.feedId, db.select({ id : feeds.id }).from(feeds).where(eq(feeds.url, feedUrl)))
    );

    return result;
}
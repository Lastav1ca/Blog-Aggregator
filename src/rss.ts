import { desc } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";
import { Agent } from "node:http";

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers : {
            'User-Agent' : "gator"
        }
    })

    if (!response){
        throw new Error("Invalid request")
    }

    const response_text = await response.text()

    const parserOptions = {
        processEntities : false
    }

    const parser = new XMLParser(parserOptions)

    const responseJObj = parser.parse(response_text);

    const channel = responseJObj.rss?.channel;

    if (!channel){
        throw new Error("Channel field doesnt exist")
    }

    const title = channel.title;
    const link = channel.link;
    const description = channel.description;

    if (!title || !link || !description){
        throw new Error("Title, link or description is non-existant")
    }

    let items = []

    if (channel.item){
        if(Array.isArray(channel.item)){
            items = channel.item
        }else{
            items = [channel.item]
        }
    }else{
        items = []
    }
    
    const cleanItems = []

    for (const item of items){
        const title = item.title;
        const link = item.link;
        const description = item.description;
        const pubDate = item.pubDate;

    if (!title || !link || !description || !pubDate) {
        continue; 
    }

    cleanItems.push({
        title,
        link,
        description,
        pubDate
    });
    }

    const feedData = {
        title : channel.title,
        description : channel.description,
        link: channel.link,
        items: cleanItems
    }

    return feedData;
}
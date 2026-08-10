import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    currentUserName : string,
    dbUrl : string
};

export function setUser (username : string) {

    const configFilePath = path.join(os.homedir(), ".gatorconfig.json")
    
    const config = readConfig();

    config.currentUserName = username;

    fs.writeFileSync(configFilePath, JSON.stringify({
        db_url : config.dbUrl,
        current_user_name : config.currentUserName,
    }));

}

export function readConfig () : Config {
    const configFilePath = path.join(os.homedir(), ".gatorconfig.json");

    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    return {
        dbUrl: config.db_url,
        currentUserName: config.current_user_name,
    };
}
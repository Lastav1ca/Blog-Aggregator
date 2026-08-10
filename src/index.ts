import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Stefan");
    const config = readConfig();

    console.log(config);
}

main();
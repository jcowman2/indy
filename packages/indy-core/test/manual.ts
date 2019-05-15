// Run ts-node manual.ts in the test directory to see the API in action.

import { Runner } from "..";

const PRINT_RECORDS = false;

const info = [];
const debug = [];
const error = [];

const newRunner = () => {
    return new Runner()
        .on("info", data => {
            process.stdout.write(data.message);
            info.push(data);
        })
        .on("debug", data => {
            process.stdout.write(data.message);
            debug.push(data);
        })
        .on("error", data => {
            process.stderr.write(data.message);
            error.push(data);
        });
};

(async () => {
    const indy = await newRunner().load({
        package: "../../../demo/indy-test-client",
        initCommands: ["npm install"],
        buildCommands: [],
        testCommands: ["npm test"]
    });

    await indy.init();
    await indy.build();

    try {
        await indy.test();
    } catch (e) {
        console.log("tests failed, as expected");
    }

    await indy.swapDependency("../../../demo/indy-fixed-lib", true);

    await indy.test(); // Should run successfully now.

    await indy.swapDependency("@jcowman/indy-broken-lib", false);

    if (PRINT_RECORDS) {
        console.log("INFO", info);
        console.log("DEBUG", debug);
        console.log("ERROR", error);
    }
})();

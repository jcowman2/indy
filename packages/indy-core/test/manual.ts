// Run ts-node manual.ts in the test directory to see the API in action.

import { Runner } from "..";

const newRunner = () => {
    return new Runner()
        .on("info", data => console.log(data.message))
        .on("debug", data => console.log(data.message))
        .on("error", data => console.log(data.message));
};

(async () => {
    const indy = await newRunner().load("indy-test-client", {
        path: "../../../demo/indy-test-client",
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

    await indy.swapDependency(
        "@jcowman/indy-broken-lib",
        "../indy-fixed-lib" // Relative to where we're running the CLI from: indy-broken-lib
    );

    await indy.test(); // Should run successfully now.

    await indy.swapDependency(
        "@jcowman/indy-broken-lib",
        "@jcowman/indy-broken-lib"
    );
})();

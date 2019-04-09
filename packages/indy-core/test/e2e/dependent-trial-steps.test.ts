import { Dependent, IndyError, Runner } from "../..";

let testClient: Dependent;

const newRunner = () => {
    return new Runner()
        .on("info", data => console.log(data.message))
        .on("debug", data => console.log(data.message))
        .on("error", data => console.log(data.message));
};

beforeAll(async done => {
    const indy = newRunner();
    testClient = await indy.load("indy-test-client", {
        path: "./demo/indy-test-client",
        initCommands: ["npm install"],
        buildCommands: [],
        testCommands: ["npm test"]
    });
    done();
});

afterAll(async done => {
    await testClient.swapDependency(
        "@jcowman/indy-broken-lib",
        "@jcowman/indy-broken-lib"
    );
    done();
});

test("e2e: Dependent trial steps", async done => {
    await testClient.init();
    await testClient.build();

    expect.assertions(2);

    // Verify current build is failing.
    try {
        await testClient.test();
    } catch (e) {
        expect(e instanceof IndyError).toBeTruthy();
        expect(e.message).toEqual(
            "One or more verification tests failed. (Code: 403) Cause: An error occurred during 'npm test'. See output for more information. (Code: 411)"
        );
    }

    await testClient.swapDependency(
        "@jcowman/indy-broken-lib",
        "../indy-fixed-lib" // Relative to where we're running the CLI from: indy-broken-lib
    );

    await testClient.test(); // Should run successfully now.

    done();
});

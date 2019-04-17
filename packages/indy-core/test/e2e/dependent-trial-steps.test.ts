import { Dependent, IndyError } from "../..";
import { TestableRunner } from "../test-utils";

const testRunner = new TestableRunner({
    ignoreMessages: [/(removed|added|audited).*package/, /found.*vulnerabil/]
});
let testClient: Dependent;

beforeAll(async done => {
    testClient = await testRunner.runner.load("indy-test-client", {
        path: "./demo/indy-test-client",
        initCommands: [
            'echo "my first init command"',
            'echo "my second init command"',
            "npm install"
        ],
        buildCommands: ['echo "my build command"'],
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

    expect.assertions(4);

    // Verify current build is failing.
    try {
        await testClient.test();
    } catch (e) {
        expect(e instanceof IndyError).toBeTruthy();

        expect(e.code).toEqual(403);
        expect(e.cause.code).toEqual(411);
    }

    await testClient.swapDependency(
        "@jcowman/indy-broken-lib",
        "../indy-fixed-lib" // Relative to where we're running the CLI from: indy-broken-lib
    );

    await testClient.test(); // Should run successfully now.

    testRunner.testSnapshot();

    done();
});

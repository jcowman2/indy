import { Dependent, IndyError } from "../..";
import { TestableRunner } from "../test-utils";

const testRunner = new TestableRunner({
    ignoreMessages: [/(removed|added|audited).*package/, /found.*vulnerabil/]
});
let testClient: Dependent;

describe("e2e: Dependent -- trial", () => {
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

    test("Dependent -- trial", async done => {
        await testClient.trial({
            dependency: "@jcowman/indy-broken-lib",
            replacement: "../indy-fixed-lib",
            expectInitialFailure: true
        });

        testRunner.testSnapshot();

        done();
    });
});

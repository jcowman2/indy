import { Dependent } from "../..";
import { TestableRunner } from "../test-utils";

const testRunner = new TestableRunner({
    ignoreMessages: [/(removed|added|audited).*package/, /found.*vulnerabil/]
});
let testClient: Dependent;

describe("e2e: Dependent -- trial", () => {
    beforeEach(async done => {
        testClient = await testRunner.runner.load({
            package: "./demo/indy-test-client",
            initCommands: [
                'echo "my first init command"',
                'echo "my second init command"',
                "npm install --no-audit"
            ],
            buildCommands: ['echo "my build command"'],
            testCommands: ["npm test"]
        });
        done();
    });

    afterEach(async done => {
        await testClient.swapDependency("@jcowman/indy-broken-lib", false);
        testRunner.reset();
        done();
    });

    test("Dependent -- trial", async done => {
        await testClient.trial({
            replacement: "demo/indy-fixed-lib",
            expectInitialFailure: true
        });

        testRunner.testSnapshot();

        done();
    });

    test("Dependent -- trialFix", async done => {
        await testClient.trialFix({
            replacement: "demo/indy-fixed-lib"
        });
        done();
    });

    test("Dependent -- passing", async done => {
        const result = await testClient.passing();
        expect(result).toBeFalsy();
        testRunner.testSnapshot();
        done();
    });
});

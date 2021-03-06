import { Dependent, IndyError } from "../..";
import { EventTestRunner } from "../test-utils";

const testRunner = new EventTestRunner();
let testClient: Dependent;

describe("e2e: Dependent -- trial steps", () => {
    beforeAll(async done => {
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

    afterAll(async done => {
        await testClient.swapDependency("@jcowman/indy-broken-lib", false);
        done();
    });

    test("Dependent -- trial steps", async done => {
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
            "./demo/indy-fixed-lib", // Relative to where we're running the CLI from
            true
        );

        await testClient.test(); // Should run successfully now.

        testRunner.testSnapshot();

        done();
    });
});

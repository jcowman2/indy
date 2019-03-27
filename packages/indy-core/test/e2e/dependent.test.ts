import { Dependent, IndyError } from "../../dist/indy-core.cjs";

let testClient;

beforeAll(() => {
    testClient = new Dependent("demo/indy-test-client", {
        test: ["npm test"]
    });
});

afterAll(async done => {
    await testClient.swapDependency(
        "@jcowman/indy-broken-lib",
        "@jcowman/indy-broken-lib"
    );
    done();
});

test("e2e: Dependent", async done => {
    await testClient.initialize();
    await testClient.build();

    expect.assertions(2);

    // Verify current build is failing.
    try {
        await testClient.test();
    } catch (e) {
        expect(e instanceof IndyError).toBeTruthy();
        expect(e.message).toEqual(
            "One or more tests failed. Caused by: An error occurred during 'npm test'. See output for more information."
        );
    }

    await testClient.swapDependency(
        "@jcowman/indy-broken-lib",
        "../indy-fixed-lib" // Relative to where we're running the CLI from: indy-broken-lib
    );

    await testClient.test(); // Should run successfully now.

    done();
});

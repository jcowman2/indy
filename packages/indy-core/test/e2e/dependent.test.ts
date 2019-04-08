import { IndyError, Runner, Dependent } from "../..";

let testClient: Dependent;

const newRunner = () => {
    return new Runner()
        .on("info", data => console.log(data.message))
        .on("error", data => {
            throw new Error(data.message);
        });
};

beforeAll(async done => {
    const indy = newRunner();
    testClient = await indy.load("indy-test-client", {
        path: "./demo/indy-test-client",
        initCommands: [],
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
test("foo", () => expect(true).toBeTruthy());

// test("e2e: Dependent", async done => {
//     await testClient.init();
//     await testClient.build();

//     expect.assertions(2);

//     // Verify current build is failing.
//     try {
//         await testClient.test();
//     } catch (e) {
//         expect(e instanceof IndyError).toBeTruthy();
//         expect(e.message).toEqual(
//             "One or more tests failed. Caused by: An error occurred during 'npm test'. See output for more information."
//         );
//     }

//     await testClient.swapDependency(
//         "@jcowman/indy-broken-lib",
//         "../indy-fixed-lib" // Relative to where we're running the CLI from: indy-broken-lib
//     );

//     await testClient.test(); // Should run successfully now.

//     done();
// });

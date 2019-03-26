import { Dependent } from "../../dist/indy-core.cjs";

// testClient.swapDependency(
//     "@jcowman/indy-broken-lib",
//     "@jcowman/indy-broken-lib"
//     // "/Users/joe/Local/GitHub/indy/demo/indy-fixed-lib"
// );

it("e2e: Dependent", async done => {
    const testClient = new Dependent("demo/indy-test-client", {
        test: ["npm test"]
    });

    await testClient.initialize();
    await testClient.build();
    await testClient.test();

    done();
});

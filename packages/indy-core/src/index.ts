import Dependent from "./dependent";

const testClient = new Dependent("demo/indy-test-client", {
    test: ["npm test"]
});

// testClient.initialize();
// testClient.build();
// testClient.test();

testClient.swapDependency(
    "@jcowman/indy-broken-lib",
    "@jcowman/indy-broken-lib"
    // "/Users/joe/Local/GitHub/indy/demo/indy-fixed-lib"
);

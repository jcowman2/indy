import Dependent from "./dependent";

const testClient = new Dependent("demo/indy-test-client", {
    test: ["npm test"]
});

testClient.initialize();
testClient.build();
testClient.test();

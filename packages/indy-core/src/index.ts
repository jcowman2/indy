import Dependent from "./dependent";

const testClient = new Dependent("demo/indy-test-client", ["npm test"]);

testClient.runTest();

const expect = require('chai').expect;
const getTen = require('./index').getTen;

it("getTen()", () => {
    expect(getTen()).to.equal(10);
})
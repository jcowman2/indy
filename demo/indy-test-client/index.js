const lib = require("@jcowman/indy-broken-lib");

// Shouldn't be a problem, right?
const getTen = () => lib.getFive() * 2;

exports.getTen = getTen;
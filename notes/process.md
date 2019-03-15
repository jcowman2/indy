## Terms
* **our package** is the Node package that we are developing.
    * the **live version** is the one that is live on npm.
    * the **staged version** is the unreleased one that we want to test.
* **dependents** are other packages that rely on ours.

## Stages
1. Install dependent.
2. Run tests to establish baseline behavior using the live version of our package.
3. Replace the dependent's dependency with the staged version of our package.
4. Re-run tests and analyze differences in behavior for regressions.
// tslint:disable: object-literal-sort-keys

const debug = "debug";
const info = "info";
const warning = "warning";
const error = "error";

export const EVENT_LIST = {
    // Debug Events: 1*
    DEBUG: {
        CUSTOM: (message: string, payload?: any) => ({
            code: 100,
            message,
            payload,
            type: debug
        }),
        PACKAGE_REFRESHED: (path: string, didChange: boolean) => ({
            code: 101,
            message: `Refreshed live package at path '${path}'. Did change = ${didChange}.\n`,
            type: debug
        }),
        SEQUENCE_CMD_COMPLETE: (command: string, exitCode: number) => ({
            code: 110,
            message: `Completed command '${command}' with exit code ${exitCode}.\n`,
            type: debug
        }),
        SEQUENCE_CMD_FAIL: (
            command: string,
            exitCode: number,
            bail: boolean
        ) => ({
            code: 111,
            message: `Command '${command}' failed with exit code ${exitCode}. Bail = ${bail}.\n`,
            type: debug
        }),
        SPAWN_COMMAND: (command: string, args: string[], cwd: string) => ({
            code: 112,
            message: `Spawning command '${command}' with args [${args}] where cwd = ${cwd}\n`,
            type: debug
        })
    },

    // Information Events: 2*
    INFO: {
        CUSTOM: (message: string) => ({
            code: 200,
            message,
            type: info
        }),
        DEPENDENT_INIT_START: (name: string) => ({
            code: 201,
            message: `Initializing ${name}...\n`,
            type: info
        }),
        DEPENDENT_INIT_SUCCESSFUL: (name: string) => ({
            code: 202,
            message: `${name} initalized successfully.\n`,
            type: info
        }),
        DEPENDENT_BUILD_START: (name: string) => ({
            code: 203,
            message: `Building ${name}...\n`,
            type: info
        }),
        DEPENDENT_BUILD_SUCCESSFUL: (name: string) => ({
            code: 204,
            message: `${name} built successfully.\n`,
            type: info
        }),
        DEPENDENT_TEST_START: (name: string) => ({
            code: 205,
            message: `Running ${name}'s verification tests...\n`,
            type: info
        }),
        DEPENDENT_TEST_SUCCESSFUL: (name: string) => ({
            code: 206,
            message: `All of ${name}'s verification tests passed!\n`,
            type: info
        }),
        DEPENDENT_USING_OVERRIDES: {
            code: 207,
            message: "Using command overrides.\n",
            type: info
        },
        DEPENDENT_SWAP_START: (pkgName: string, dependencyName: string) => ({
            code: 208,
            message: `Swapping ${pkgName}'s ${dependencyName} dependency...\n`,
            type: info
        }),
        DEPENDENT_SWAP_SUCCESSFUL: (
            pkgName: string,
            dependencyName: string,
            originalVersion: string,
            newVersion: string
        ) => ({
            code: 209,
            message: `${pkgName}'s ${dependencyName} dependency swapped from ${originalVersion} to ${newVersion} successfully.\n`,
            type: info
        }),
        SPAWN_COMMAND_STDOUT: (data: string) => ({
            code: 210,
            message: data,
            type: info
        }),
        DEPENDENT_TRIAL_START: (
            pkgName: string,
            dependencyName: string,
            replacementPath: string
        ) => ({
            code: 211,
            message: `Starting trial of ${dependencyName}@${replacementPath} for ${pkgName}...\n`,
            type: info
        })
    },

    // Warning Events: 3*
    WARNING: {
        CUSTOM: (message: string) => ({
            code: 300,
            message,
            type: warning
        }),
        DEPENDENT_NOT_INITIALIZED: (name: string, stage: string) => ({
            code: 301,
            message: `${name} has not been initialized. Running the ${stage} commands may have undesired behavior.\n`,
            type: warning
        }),
        DEPENDENT_NOT_BUILT: (name: string, stage: string) => ({
            code: 302,
            message: `${name} has not been built. Running the ${stage} commands may have undesired behavior.\n`,
            type: warning
        })
    },

    // Error Events: 4*
    ERROR: {
        CUSTOM: (message: string, cause?: Error) => ({
            code: 400,
            message,
            type: error,
            cause
        }),
        DEPENDENT_INIT_FAILED: (cause?: Error) => ({
            code: 401,
            message: "Initialization failed.\n",
            type: error,
            cause
        }),
        DEPENDENT_BUILD_FAILED: (cause?: Error) => ({
            code: 402,
            message: "Build failed.\n",
            type: error,
            cause
        }),
        DEPENDENT_TEST_FAILED: (cause?: Error) => ({
            code: 403,
            message: "One or more verification tests failed.\n",
            type: error,
            cause
        }),
        DEPENDENCY_NOT_FOUND: (pkgName: string, dependencyName: string) => ({
            code: 404,
            message: `${pkgName} does not have the required dependency: ${dependencyName}.\n`,
            type: error
        }),
        DEPENDENCY_SWAP_FAILED: (
            pkgName: string,
            dependencyName: string,
            originalVersion: string,
            desiredVersion: string,
            cause?: Error
        ) => ({
            code: 405,
            message: `${pkgName}'s ${dependencyName} dependency could not be swapped from ${originalVersion} to ${desiredVersion}.\n`,
            type: error,
            cause
        }),
        COULD_NOT_RESOLVE_PACKAGE: (packagePath: string, cause?: Error) => ({
            code: 406,
            message: `Could not resolve a package.json file at '${packagePath}'.\n`,
            type: error,
            cause
        }),
        COULD_NOT_LOAD_DEPENDENT: (path: string, cause?: Error) => ({
            code: 407,
            message: `An error occurred while loading a dependent at '${path}'.\n`,
            type: error,
            cause
        }),
        DEPENDENT_TRIAL_EXPECTED_FAILURE: (name: string) => ({
            code: 408,
            message: `Expected ${name}'s verification tests to fail during trial, but they passed.\n`,
            type: error
        }),
        SPAWN_COMMAND_STDERR: (data: string) => ({
            code: 410,
            message: data,
            type: error
        }),
        SPAWN_SEQUENCE_BAIL: (command: string) => ({
            code: 411,
            message: `An error occurred during '${command}'. See output for more information.\n`,
            type: error
        }),
        EMIT_ILLEGAL_EVENT: (type: string) => ({
            code: 412,
            message: `Cannot emit illegal event type: ${type}.\n`,
            type: error
        })
    }
};

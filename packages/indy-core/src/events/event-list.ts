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
        SEQUENCE_CMD_COMPLETE: (command: string, exitCode: number) => ({
            code: 110,
            message: `Completed command '${command}' with exit code ${exitCode}.`,
            type: debug
        }),
        SEQUENCE_CMD_FAIL: (
            command: string,
            exitCode: number,
            bail: boolean
        ) => ({
            code: 111,
            message: `Command '${command}' failed with exit code ${exitCode}. Bail = ${bail}.`,
            type: debug
        }),
        SPAWN_COMMAND: (command: string, args: string[], cwd: string) => ({
            code: 112,
            message: `Spawning command '${command}' with args [${args}] where cwd = ${cwd}`,
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
            message: `Initializing ${name}...`,
            type: info
        }),
        DEPENDENT_INIT_SUCCESSFUL: (name: string) => ({
            code: 202,
            message: `${name} initalized successfully.`,
            type: info
        }),
        DEPENDENT_BUILD_START: (name: string) => ({
            code: 203,
            message: `Building ${name}...`,
            type: info
        }),
        DEPENDENT_BUILD_SUCCESSFUL: (name: string) => ({
            code: 204,
            message: `${name} built successfully.`,
            type: info
        }),
        DEPENDENT_TEST_START: (name: string) => ({
            code: 205,
            message: `Running ${name}'s verification tests...`,
            type: info
        }),
        DEPENDENT_TEST_SUCCESSFUL: (name: string) => ({
            code: 206,
            message: `All of ${name}'s verification tests passed!`,
            type: info
        }),
        DEPENDENT_USING_OVERRIDES: {
            code: 207,
            message: "Using command overrides.",
            type: info
        },
        DEPENDENT_SWAP_START: (pkgName: string, dependencyName: string) => ({
            code: 208,
            message: `Swapping ${pkgName}'s ${dependencyName} dependency...`,
            type: info
        }),
        DEPENDENT_SWAP_SUCCESSFUL: (
            pkgName: string,
            dependencyName: string,
            originalVersion: string,
            newVersion: string
        ) => ({
            code: 209,
            message: `${pkgName}'s ${dependencyName} dependency swapped from ${originalVersion} to ${newVersion} successfully.`,
            type: info
        }),
        SPAWN_COMMAND_STDOUT: (data: string) => ({
            code: 210,
            message: data,
            type: info
        })
    },

    // Warning Events: 3*
    WARNING: {
        CUSTOM: (message: string) => ({
            code: 300,
            message,
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
            message: "Initialization failed.",
            type: error,
            cause
        }),
        DEPENDENT_BUILD_FAILED: (cause?: Error) => ({
            code: 402,
            message: "Build failed.",
            type: error,
            cause
        }),
        DEPENDENT_TEST_FAILED: (cause?: Error) => ({
            code: 403,
            message: "One or more verification tests failed.",
            type: error,
            cause
        }),
        DEPENDENCY_NOT_FOUND: (pkgName: string, dependencyName: string) => ({
            code: 404,
            message: `${pkgName} does not have the required dependency: ${dependencyName}`,
            type: error
        }),
        DEPENDENCY_SWAP_FAILED: (
            pkgName: string,
            dependencyName: string,
            originalVersion: string,
            desiredVersion: string
        ) => ({
            code: 405,
            message: `${pkgName}'s ${dependencyName} dependency could not be swapped from ${originalVersion} to ${desiredVersion}.`,
            type: error
        }),
        COULD_NOT_LOAD_PACKAGE: (packagePath: string, cause?: Error) => ({
            code: 406,
            message: `Could not resolve a package.json file at '${packagePath}'.`,
            type: error,
            cause
        }),
        SPAWN_COMMAND_STDERR: (data: string) => ({
            code: 410,
            message: data,
            type: error
        }),
        SPAWN_SEQUENCE_BAIL: (command: string) => ({
            code: 411,
            message: `An error occurred during '${command}'. See output for more information.`,
            type: error
        }),
        EMIT_ILLEGAL_EVENT: (type: string) => ({
            code: 412,
            message: `Cannot emit illegal event type: ${type}.`,
            type: error
        })
    }
};

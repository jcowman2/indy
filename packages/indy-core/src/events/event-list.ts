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
            message: `Completed command (${command}) with exit code (${exitCode}).`,
            type: debug
        }),
        SEQUENCE_CMD_FAIL: (
            command: string,
            exitCode: number,
            bail: boolean
        ) => ({
            code: 111,
            message: `Command (${command}) failed with exit code (${exitCode}). Bail = ${bail}.`,
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
        DEPENDENT_INIT_SUCCESSFUL: {
            code: 202,
            message: "Dependent initalized successfully.",
            type: info
        },
        DEPENDENT_BUILD_SUCCESSFUL: {
            code: 204,
            message: "Dependent built successfully.",
            type: info
        },
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

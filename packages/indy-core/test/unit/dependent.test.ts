import {
    SingleDependentArgs,
    singleDependentProvider
} from "../../src/dependent";
import { IndyError } from "../../src/events";

const mockDependent = (args: Partial<SingleDependentArgs> = {}) => {
    const defaultArgs = {
        pkg: jest.fn(),
        emitter: {
            emit: jest.fn(),
            emitAndThrow: jest.fn()
        },
        processManager: {
            spawnSequence: jest.fn()
        }
    };

    const combinedArgs = { ...defaultArgs, ...args };
    const dependent = singleDependentProvider(
        combinedArgs as SingleDependentArgs
    );

    return { dependent, ...combinedArgs };
};

describe("Dependent", () => {
    describe("Constructor", () => {
        test("Command lists are empty if not included", () => {
            const { dependent } = mockDependent();

            expect(dependent.initCommands).toEqual([]);
            expect(dependent.buildCommands).toEqual([]);
            expect(dependent.testCommands).toEqual([]);
        });
    });

    describe("init", () => {
        test("Dependent uses its configured initCommands if no argument given", async done => {
            const initCommands = ["command 1", "command 2"];
            const { dependent, processManager } = mockDependent({
                initCommands
            });

            await dependent.init();

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                initCommands
            );

            done();
        });

        test("Dependent uses initCommands given by argument if there are any", async done => {
            const initCommands = ["command 1", "command 2"];
            const overrides = ["command 3"];
            const { dependent, processManager } = mockDependent({
                initCommands
            });

            await dependent.init(overrides);

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                overrides
            );

            done();
        });
    });

    test("Emit init start and init success events if initialization is successful", async done => {
        const { dependent, emitter } = mockDependent();

        await dependent.init();

        const emitterCalls = (emitter.emit as any).mock.calls;

        expect(emitterCalls[0][0].code).toBe(201);
        expect(emitterCalls[1][0].code).toBe(202);

        done();
    });

    test("Emit and throw a fail event if initialization fails", async done => {
        const failingCommand = "command fails";

        const { dependent, emitter } = mockDependent({
            initCommands: [failingCommand],
            processManager: {
                spawnSequence: jest
                    .fn()
                    .mockImplementation((commands: string[]) => {
                        if (commands.includes(failingCommand)) {
                            throw new Error("err");
                        }
                    }),
                spawnCommand: jest.fn()
            }
        });

        await dependent.init();

        expect((emitter.emit as any).mock.calls[0][0].code).toBe(201);
        expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(401);

        done();
    });
});

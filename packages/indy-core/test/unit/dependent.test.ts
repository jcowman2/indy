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
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                401
            );

            done();
        });
    });

    describe("build", () => {
        test("Dependent uses its configured buildCommands if no argument given", async done => {
            const buildCommands = ["command 1", "command 2"];
            const { dependent, processManager } = mockDependent({
                buildCommands
            });

            await dependent.build();

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                buildCommands
            );

            done();
        });

        test("Dependent uses buildCommands given by argument if there are any", async done => {
            const buildCommands = ["command 1", "command 2"];
            const overrides = ["command 3"];
            const { dependent, processManager } = mockDependent({
                buildCommands
            });

            await dependent.build(overrides);

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                overrides
            );

            done();
        });

        test("Emit build start and build success events if build is successful", async done => {
            const { dependent, emitter } = mockDependent();

            await dependent.build();

            const emitterCalls = (emitter.emit as any).mock.calls;

            expect(emitterCalls[0][0].code).toBe(203);
            expect(emitterCalls[1][0].code).toBe(204);

            done();
        });

        test("Emit and throw a fail event if build fails", async done => {
            const failingCommand = "command fails";

            const { dependent, emitter } = mockDependent({
                buildCommands: [failingCommand],
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

            await dependent.build();

            expect((emitter.emit as any).mock.calls[0][0].code).toBe(203);
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                402
            );

            done();
        });
    });

    describe("test", () => {
        test("Dependent uses its configured testCommands if no argument given", async done => {
            const testCommands = ["command 1", "command 2"];
            const { dependent, processManager } = mockDependent({
                testCommands
            });

            await dependent.test();

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                testCommands
            );

            done();
        });

        test("Dependent uses testCommands given by argument if there are any", async done => {
            const testCommands = ["command 1", "command 2"];
            const overrides = ["command 3"];
            const { dependent, processManager } = mockDependent({
                testCommands
            });

            await dependent.test(overrides);

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                overrides
            );

            done();
        });

        test("Emit test start and test success events if test is successful", async done => {
            const { dependent, emitter } = mockDependent();

            await dependent.test();

            const emitterCalls = (emitter.emit as any).mock.calls;

            expect(emitterCalls[0][0].code).toBe(205);
            expect(emitterCalls[1][0].code).toBe(206);

            done();
        });

        test("Emit and throw a fail event if test fails", async done => {
            const failingCommand = "command fails";

            const { dependent, emitter } = mockDependent({
                testCommands: [failingCommand],
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

            await dependent.test();

            expect((emitter.emit as any).mock.calls[0][0].code).toBe(205);
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                403
            );

            done();
        });
    });
});

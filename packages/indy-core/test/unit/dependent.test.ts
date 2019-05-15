import { PackageLive } from "../../dist/indy-core/src/package";
import {
    SingleDependentArgs,
    singleDependentProvider
} from "../../src/dependent";
import { SingleDependentImpl } from "../../src/dependent/single-dependent-impl";
import { IndyError, RunnerEventData } from "../../src/events";
import { Package, PackageLiveArgs } from "../../src/package";
import { join } from "path";

const mockDependent = (args: Partial<SingleDependentArgs> = {}) => {
    const defaultArgs = {
        pkg: {
            refresh: jest.fn(),
            toStatic: jest.fn().mockImplementation(() => Promise.resolve({})),
            _loadPackage: jest.fn()
        },
        emitter: {
            emit: jest.fn(),
            emitAndThrow: jest
                .fn()
                .mockImplementation((err: RunnerEventData) => {
                    throw new IndyError(err.message, err.code, err.cause);
                })
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

const dummyPkgLiveProvider = (path: string, pkg: Partial<Package>) => (
    args: PackageLiveArgs
) => {
    const cwdPath = join(process.cwd(), path, "package.json");

    if (args.path !== cwdPath) {
        console.error(`Invalid path: ${args.path} !== ${cwdPath}`);
        throw new Error();
    }

    const pkgLive: PackageLive = {
        refresh: jest.fn(),
        toStatic: jest.fn().mockReturnValue(pkg)
    };

    return pkgLive;
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
                    workingDirectory: process.cwd(),
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

            let errorHappened = false;

            try {
                await dependent.init();
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
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
            (dependent as any).isInitialized = true;

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
                    workingDirectory: process.cwd(),
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

            let errorHappened = false;

            try {
                await dependent.build();
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
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

            (dependent as any).isInitialized = true;
            (dependent as any).isBuilt = true;

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
                    workingDirectory: process.cwd(),
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

            let errorHappened = false;

            try {
                await dependent.test();
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
            expect((emitter.emit as any).mock.calls[0][0].code).toBe(205);
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                403
            );

            done();
        });
    });

    describe("swapDependency", () => {
        test("Emit and throw an error if the package doesn't exist or is missing the dependencies property", async done => {
            const { dependent, emitter } = mockDependent();

            let errorHappened = false;

            try {
                await dependent.swapDependency("../foo", true);
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                406
            );

            done();
        });

        test("Emit and throw an error if the package doesn't have the specific dependency", async done => {
            const { dependent, emitter } = mockDependent({
                pkg: {
                    refresh: jest.fn(),
                    toStatic: jest.fn().mockImplementation(() =>
                        Promise.resolve({
                            name: "testPkg",
                            version: "v1.0.0",
                            dependencies: {
                                bar: "v1.0.0"
                            }
                        })
                    ),
                    _loadPackage: jest.fn()
                } as any
            });

            (dependent as SingleDependentImpl).pkgLiveProvider = dummyPkgLiveProvider(
                "../foo",
                { name: "@jcowman/foo" }
            );

            let errorHappened = false;

            try {
                await dependent.swapDependency("../foo", true);
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
            expect((emitter.emit as any).mock.calls[0][0].code).toBe(208);
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                404
            );

            done();
        });

        test("Swap successful and emit success message", async done => {
            const { dependent, emitter, processManager } = mockDependent({
                pkg: {
                    refresh: jest.fn(),
                    toStatic: jest.fn().mockImplementation(() => ({
                        name: "testPkg",
                        version: "v1.0.0",
                        dependencies: {
                            "@jcowman/foo": "v1.0.0"
                        }
                    })),
                    _loadPackage: jest.fn()
                } as any,
                processManager: {
                    workingDirectory: join(process.cwd(), "bar"),
                    spawnCommand: jest.fn(),
                    spawnSequence: jest.fn()
                }
            });

            (dependent as SingleDependentImpl).pkgLiveProvider = dummyPkgLiveProvider(
                "./foo",
                { name: "@jcowman/foo" }
            );

            await dependent.swapDependency("./foo", true);

            expect(processManager.spawnSequence).toHaveBeenCalledWith([
                "npm uninstall @jcowman/foo --no-audit",
                "npm install ../foo --no-audit"
            ]);

            const emitterCalls = (emitter.emit as any).mock.calls;

            expect(emitterCalls[0][0].code).toBe(208);
            expect(emitterCalls[1][0].code).toBe(209);

            done();
        });

        test("Swap failure emits failure message", async done => {
            const { dependent, emitter, processManager } = mockDependent({
                pkg: {
                    refresh: jest.fn(),
                    toStatic: jest.fn().mockImplementation(() => ({
                        name: "testPkg",
                        version: "v1.0.0",
                        dependencies: {
                            "@jcowman/foo": "v1.0.0"
                        }
                    })),
                    _loadPackage: jest.fn()
                } as any,
                processManager: {
                    workingDirectory: process.cwd(),
                    spawnSequence: jest.fn().mockImplementationOnce(() => {
                        throw new Error("err");
                    }),
                    spawnCommand: jest.fn()
                }
            });

            (dependent as SingleDependentImpl).pkgLiveProvider = dummyPkgLiveProvider(
                "../foo",
                { name: "@jcowman/foo" }
            );

            let errorHappened = false;

            try {
                await dependent.swapDependency("../foo", true);
            } catch (e) {
                errorHappened = true;
            }

            expect(errorHappened).toBeTruthy();
            expect(processManager.spawnSequence).toHaveBeenCalledWith([
                "npm uninstall @jcowman/foo --no-audit",
                "npm install ../foo --no-audit"
            ]);
            expect((emitter.emit as any).mock.calls[0][0].code).toBe(208);
            expect((emitter.emitAndThrow as any).mock.calls[0][0].code).toBe(
                405
            );

            done();
        });

        test.skip("Resolve false if the current version and new version are the same", async done => {
            // TODO
        });

        test.skip("Resolve true if the current version and new version are not the same", async done => {
            // TODO
        });
    });
});

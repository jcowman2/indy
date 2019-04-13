import {
    SingleDependentArgs,
    singleDependentProvider
} from "../../src/dependent";

const mockDependent = (args: Partial<SingleDependentArgs> = {}) => {
    const defaultArgs = {
        pkg: jest.fn(),
        emitter: {
            emit: jest.fn()
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
        it("Command lists are empty if not included", () => {
            const { dependent } = mockDependent();

            expect(dependent.initCommands).toEqual([]);
            expect(dependent.buildCommands).toEqual([]);
            expect(dependent.testCommands).toEqual([]);
        });
    });

    describe("init", () => {
        it("Dependent uses its configured initCommands if no argument given", async done => {
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

        it("Dependent uses initCommands given by argument if there are any", async done => {
            const initCommands = ["command 1", "command 2"];
            const overrides = ["command 3"];
            const { dependent, processManager } = mockDependent({
                initCommands
            });

            await dependent.init(overrides);

            expect(processManager.spawnSequence).toHaveBeenCalledWith(
                initCommands
            );

            done();
        });
    });
});

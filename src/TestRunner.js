const TestReporter = require('./TestReporter');
const {promiseTimeout, TABULATION, TIMEOUT} = require('./utils');

class TestRunner {
    constructor({commandLineArgs}) {
        this.failing = 0;
        this.passing = 0;

        this.testTreeNodes = [];

        this.errorMessages = [];

        this.suites = [];
        this.currentSuiteTests = [];
        this.currentSuiteBeforeHooks = [];

        this.onlyFlag = false;

        // in a real app, a command line args parser would be used for this
        this.commandLineArgs = {
            time: commandLineArgs === '--time',
            timeout: commandLineArgs === '--timeout'
        };
    }

    async execute() {
        const testsStartTime = new Date().valueOf();

        await this.runRootLevelTests();

        await this.runSuites();

        TestReporter.report({
            testTreeNodes: this.testTreeNodes,
            passing: this.passing,
            failing: this.failing,
            errorMessages: this.errorMessages,
            time: this.commandLineArgs.time
                ? new Date().valueOf() - testsStartTime
                : null
        });
    }

    beforeRunTests() {
        if (this.onlyFlag) {
            this.currentSuiteTests = this.currentSuiteTests
                .filter(([,, label]) => label && label === 'only')
        }
    }

    onTestFail(i, description, message) {
        const errorMessage = `  ${i}) ${description}:\n\n      ${message}`;

        this.errorMessages.push(errorMessage);
    }

    async runRootLevelTests() {
        if (this.currentSuiteTests) {
            await this.runTests();

            this.currentSuiteTests = [];
        }
    }

    async runSuites() {
        for (let i = 0; i < this.suites.length; ++i) {
            const [description, fn] = this.suites[i];

            await fn();

            await this.runTests(i, description);

            this.currentSuiteTests = [];
        }
    }

    generateSuiteDescription(suiteI, description) {
        this.testTreeNodes.push(' '.repeat((suiteI+1)*TABULATION) + description);
    }

    addSuiteDescription(suiteI, description) {
        if (this.onlyFlag) {
            if (description && this.currentSuiteTests.length) {
                this.generateSuiteDescription(suiteI, description);
            }
        } else {
            if (description) {
                this.generateSuiteDescription(suiteI, description);
            }
        }
    }

    async runTests(suiteI, description) {
        this.beforeRunTests();

        this.addSuiteDescription(suiteI, description);

        if (this.currentSuiteTests.length) {
            for (const test of this.currentSuiteTests) {
                for (const hook of this.currentSuiteBeforeHooks) {
                    await hook();
                }

                await this.runTest(test);
            }
        }
    }

    async runTest([description, fn]) {
        let success;
        const testStartTime = new Date().valueOf();

        try {
            if (this.commandLineArgs.timeout) {
                await promiseTimeout(TIMEOUT, fn());;
            } else {
                await fn();
            }

            this.passing++;

            success = true;
        } catch (e) {
            this.failing++;

            success = false;

            this.onTestFail(this.failing, description, e.toString());
        } finally {
            const statusIndicator = success ? '✓' : `${this.failing})`;

            const timeStr = this.commandLineArgs.time && success
                ? ` ${new Date().valueOf() - testStartTime} (ms)`
                : '';

            this.testTreeNodes.push(`${statusIndicator} ${description}${timeStr}`);
        }
    }
}

module.exports = TestRunner;
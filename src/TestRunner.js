const TestSummarizer = require('./TestSummarizer');

class TestRunner {
    constructor() {
        this.failing = 0;
        this.passing = 0;

        this.testTreeNodes = [];

        this.errorMessages = [];

        this.suites = [];
        this.currentSuiteTests = [];
        this.currentSuiteBeforeHooks = [];

        this.onlyFlag = false;
    }

    async execute() {
        await this.runRootLevelTests();

        await this.runSuites();

        TestSummarizer.report(
            this.testTreeNodes, this.passing, this.failing, this.errorMessages
        );
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

    addSuiteDescription(suiteI, description) {
        if (this.onlyFlag) {
            if (description && this.currentSuiteTests.length) {
                this.testTreeNodes.push(' '.repeat((suiteI+1)*2) + description);
            }
        } else {
            if (description) {
                this.testTreeNodes.push(' '.repeat((suiteI+1)*2) + description);
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
        try {
            await fn();

            this.passing++;

            this.testTreeNodes.push(`✓ ${description}`);
        } catch (e) {
            this.failing++;

            this.testTreeNodes.push(`${this.failing}) ${description}`);

            this.onTestFail(this.failing, description, e.toString());
        }
    }
}

module.exports = TestRunner;
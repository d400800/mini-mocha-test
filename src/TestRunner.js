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

    execute() {
        this.runRootLevelTests();
        this.runSuites();
        this.report();
    }

    beforeRunTests() {
        if (this.onlyFlag) {
            this.currentSuiteTests = this.currentSuiteTests
                .filter(test => test[2] && test[2] === 'only')
        }
    }

    log(message) {
        console.log(message);
    }

    // TODO: refactor, maybe even put in a separate entity
    printTestTree(tree) {
        let spaces = 0;
        let result = '';

        for (let node of tree) {
            const leadingSpaces = node.match(/^\s*/g)[0].length;

            if (leadingSpaces) {
                result += node + '\n';
                spaces = leadingSpaces;
                continue;
            }

            result += ' '.repeat(spaces + 2) + node + '\n';
        }

        this.log(result);
    }

    summarizeResults() {
        this.log(`  ${this.passing} passing`);

        if (this.failing > 0) {
            this.log(`  ${this.failing} failing`);
        }
    }

    onError(i, description, message) {
        const errorMessage = `  ${i}) ${description}:\n\n      ${message}`;

        this.errorMessages.push(errorMessage);
    }

    printErrorMessages() {
        for (let message of this.errorMessages) {
            this.log('\n' + message);
        }
    }

    runRootLevelTests() {
        if (this.currentSuiteTests) {
            this.runTests();

            this.currentSuiteTests = [];
        }
    }

    runSuites() {
        for (let i = 0; i < this.suites.length; ++i) {
            const [description, fn] = this.suites[i];

            fn();

            this.runTests(i, description);

            this.currentSuiteTests = [];
        }
    }

    printSuiteDescription(suiteI, description) {
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

    runTests(suiteI, description) {
        this.beforeRunTests();

        this.printSuiteDescription(suiteI, description);

        if (this.currentSuiteTests.length) {
            for (const test of this.currentSuiteTests) {
                for (const hook of this.currentSuiteBeforeHooks) {
                    hook();
                }

                this.runTest(test);
            }
        }
    }

    runTest([description, fn]) {
        try {
            fn();
            this.passing++;
            this.testTreeNodes.push(`✓ ${description}`);
        } catch (e) {
            this.failing++;
            this.testTreeNodes.push(`${this.failing}) ${description}`);
            this.onError(this.failing, description, e.toString());
        }
    }

    report() {
        this.printTestTree(this.testTreeNodes);

        this.summarizeResults();

        this.printErrorMessages();
    }
}

module.exports = TestRunner;
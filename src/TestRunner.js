class TestRunner {
    constructor() {
        this.failing = 0;
        this.passing = 0;
        this.testTreeNodes = [];
        this.errorMessages = [];
        this.suites = [];
    }

    printTestTree() {
        const result = this.testTreeNodes
            .reduce((acc, curr, i) => acc + `${' '.repeat((i+1)*2)}${curr}\n`, '');

        console.log(result);
    }

    summarizeResults() {
        console.log(`  ${this.passing} passing`);

        if (this.failing > 0) {
            console.log(`  ${this.failing} failing`);
        }
    }

    onError(i, description, message) {
        const errorMessage = `  ${i}) ${description}:\n\n      ${message}`;

        this.errorMessages.push(errorMessage);
    }

    printErrorMessages() {
        for (let message of this.errorMessages) {
            console.log('\n' + message);
        }
    }

    runSuites() {
        for (const [description, fn] of this.suites) {
            this.testTreeNodes.push(description);
            fn();
        }
    }

    report() {
        this.printTestTree();

        this.summarizeResults();

        this.printErrorMessages();
    }
}

module.exports = TestRunner;
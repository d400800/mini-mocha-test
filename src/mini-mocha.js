class TestRunner {
  constructor() {
    this.failing = 0;
    this.passing = 0;
    this.branches = [];
    this.errorMessages = [];
  }

  printTestTree() {
    const result = this.branches
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

  runTests() {}

  report() {
    this.printTestTree();

    this.summarizeResults();

    this.printErrorMessages();
  }
}

const testRunner = new TestRunner();

global.it = function(description, fn) {
  try {
    fn();
    testRunner.passing++;
    testRunner.branches.push(`✓ ${description}`);

  } catch (e) {
    testRunner.failing++;
    testRunner.branches.push(`${testRunner.failing}) ${description}`);
    testRunner.onError(testRunner.failing, description, e.toString());
  }
};

global.describe = function (description, fn) {
  testRunner.branches.push(description);

  try {
    fn();
  } catch (e) {
    console.log('handle me');
  }
}

require(process.argv[2]);

testRunner.report();

//console.log(`  ✓ ${description}`);
//console.log(`  ${countPassed} passing`);

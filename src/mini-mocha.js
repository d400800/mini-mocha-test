const TestRunner = require('./TestRunner');

const testRunner = new TestRunner();

global.it = function(description, fn) {
  try {
    fn();
    testRunner.passing++;
    testRunner.testTreeNodes.push(`✓ ${description}`);

  } catch (e) {
    testRunner.failing++;
    testRunner.testTreeNodes.push(`${testRunner.failing}) ${description}`);
    testRunner.onError(testRunner.failing, description, e.toString());
  }
};

global.describe = function (description, fn) {
  try {
    testRunner.suites.push([description, fn]);
  } catch (e) {
    console.log('handle me');
  }
}

require(process.argv[2]);

testRunner.runSuites();
testRunner.report();

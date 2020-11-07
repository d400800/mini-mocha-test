'use strict';

const TestRunner = require('./TestRunner');

global.it = function(description, fn) {
  testRunner.currentSuiteTests.push([description, fn]);
};

it.only = function (description, fn) {
  if (!testRunner.onlyFlag) testRunner.onlyFlag = true;
  testRunner.currentSuiteTests.push([description, fn, 'only']);
}

global.describe = function(description, fn) {
  testRunner.suites.push([description, fn]);
}

global.beforeEach = function(fn) {
  testRunner.currentSuiteBeforeHooks.push(fn);
}

const commandLineArgs = process.argv[3] && process.argv[3];

const testRunner = new TestRunner({commandLineArgs});

require(process.argv[2]);

testRunner.execute();
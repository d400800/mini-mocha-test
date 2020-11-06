'use strict';

const TestRunner = require('./TestRunner');

const testRunner = new TestRunner();

const arr = [];

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

require(process.argv[2]);

testRunner.execute();
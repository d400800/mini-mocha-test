const assert = require('assert');
const {resolve} = require('path');
const {spawnSync} = require('child_process');
const {readFileSync, readdirSync, writeFileSync} = require('fs');

const miniMocha = resolve(__dirname, '..', 'src', 'mini-mocha');
const specSuffix = '.spec.js';

function fixture(fileName) {
  return resolve(__dirname, 'fixtures', fileName);
}

function getCommandLineArgs(name) {
  if (name.indexOf('with-time-report') > -1) return '--time';

  if (name.indexOf('with-timeout') > -1) return '--timeout';

  return '';
}

function testFixture(name) {
  it(`should have correct output for ${name}`, () => {
    const {stdout, stderr} = spawnSync('node', [miniMocha, fixture(`${name}${specSuffix}`), getCommandLineArgs(name)]);
    const expected = readFileSync(fixture(`${name}.expected.txt`));
    if (stdout.toString()) {
      writeFileSync(fixture(`${name}.actual.txt`), stdout.toString());
    } else {
      writeFileSync(fixture(`${name}.actual.txt`), stderr.toString());
    }

    assert.equal(stdout.toString().trim(), expected.toString().trim());
  });
}

readdirSync(fixture(''))
  .sort()
  .filter(_ => _.endsWith(specSuffix))
  .map(_ => {
    return _.slice(0, -1 * specSuffix.length);
  })
  .slice(13,14)
  .forEach(_ => testFixture(_));

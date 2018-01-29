const path = require('path');
const fs = require('fs');
const assert = require('assert');
const babel = require('babel-core');

function trim(str) {
    return str.replace(/^\s+|\s+$/, '');
}

describe('fixtures', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');

    fs.readdirSync(fixturesDir).map((caseName) => {
        if (caseName === '.babelrc' || caseName === '.eslintrc') return;

        it(caseName.split('-').join(' '), () => {
            const fixtureDir = path.join(fixturesDir, caseName);
            const actual = babel.transformFileSync(path.join(fixtureDir, 'actual.js')).code;
            const expected = fs.readFileSync(path.join(fixtureDir, 'expected.js')).toString();

            assert.equal(trim(actual), trim(expected));
        });
    });
});

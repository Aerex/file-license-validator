const Code = require('code');
const Lab = require('lab');
const sinon = require('sinon');
const flv = require('../../index');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const fs = require('fs');
const fail = Code.fail;
const before = lab.before;
const afterEach = lab.afterEach;
const beforeEach = lab.beforeEach;
const expect = Code.expect;


describe('FLV', () => {
	beforeEach(done => {

	})
	it('should return invalid licenses when not included in the allowed list', done => {

			flv('')
	})

	it('should validate a simple license', done => {

	})
})

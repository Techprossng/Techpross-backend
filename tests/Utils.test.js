const { describe, it } = require('mocha');
const { expect } = require('chai');

const {
    checkIsEmail, checkDigit, checkString, hashPassword, verifyPassword
} = require('../src/utils').Util;

describe('Regex patterns', function () {
    it('That correct email pattern is entered', () => {
        const emails = ['test@email.com', 'test2email.com'];
        expect(checkIsEmail(emails[0])).to.be.equals(true);
        expect(checkIsEmail(emails[1])).to.be.equals(false);
    });

    it('checkDigit function', () => {
        expect(checkDigit('123')).to.be.equals(true);
        expect(checkDigit('23n5')).to.be.equals(false);
    });

    it('checkString function', () => {
        expect(checkString('taiwo')).to.be.equals(true);
        expect(checkString('taiwo@gmail')).to.be.equals(false);
    });
});

describe('Password hash and verification', function () {
    it('checks password hash and verification', async () => {
        const password = 'mytestpass';
        const hash = await hashPassword(password);
        const isVerified = await verifyPassword(password, hash);
        const isNotVerified = await verifyPassword('wrong', hash);
        expect(hash).to.be.a('string');
        expect(isVerified).to.be.true;
        expect(isNotVerified).to.be.false;
    })
})



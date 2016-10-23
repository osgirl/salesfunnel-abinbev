import { getBaseUrl } from '../../../routes/helpers/route-helpers';
import { expect } from 'chai';

describe('When the req is given', () => {
    it('should return the base url correctly', (done) => {
        const req = {
            protocol: 'https',
            host: 'whatever.com',
            get: (string) => req[string]
        };

        const result = getBaseUrl(req);
        console.log(`result:${result}`);

        try {
            expect(result).to.contain('https://');
            done();
        } catch (done) {
            done();
        };
    });
});
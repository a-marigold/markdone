import { describe, it, expect } from 'bun:test';

import { checkHasContent } from '../../parser/utils';

describe('checkHasContent', () => {
    it('should work only with place from received `start` to `end` arguments', () => {
        const string = ' abcdef \r\n';

        expect(checkHasContent(string, 1, string.length)).toBe(true);
        expect(checkHasContent(string, 0, string.length)).toBe(false);
        expect(checkHasContent(string, 8, string.length)).toBe(false);
    });

    it('should return false if the `source` contains only empty characters', () => {
        const string = '\t\t\t\t \n \r\n \r\n \n     ';

        expect(checkHasContent(string, 0, string.length)).toBe(false);
    });

    it('should return true if the `source` contains any not empty character', () => {
        const string = '\t abcdef \r\n';
        expect(checkHasContent(string, 0, string.length)).toBe(true);
    });
});

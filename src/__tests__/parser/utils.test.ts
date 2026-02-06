import { describe, it, expect } from 'bun:test';

import {
    checkHasContent,
    checkStartOfLine,
    checkHasText,
} from '../../parser/utils';

describe('checkHasContent', () => {
    it('should work only with place from received `start` to `end` arguments', () => {
        const source = ' abcdef \r\n';

        expect(checkHasContent(source, 1, source.length)).toBe(true);

        expect(checkHasContent(source, 0, 1)).toBe(false);
        expect(checkHasContent(source, 8, source.length)).toBe(false);
    });

    it('should return false if the `source` contains only empty characters', () => {
        const source = '\t\t\t\t \n \r\n \r\n \n     ';
        expect(checkHasContent(source, 0, source.length)).toBe(false);
    });

    it('should return true if the `source` contains any non empty character', () => {
        const source = '\t abcdef \r\n';

        expect(checkHasContent(source, 0, source.length)).toBe(true);
    });
});

describe('checkNewLine', () => {
    it('should return true if `pos` is in the start of `source`', () => {
        const source = '    # abcde';

        const pos = 1;
        expect(checkStartOfLine(source, 0, pos)).toBe(true);
    });

    it('should skip spaces and tabs while `pos` is more than `sourceStart`', () => {
        const source = '\t\t\t   ';

        const pos = source.length - 1;

        expect(checkStartOfLine(source, 0, pos)).toBe(true);
    });

    it('should return false if there is any non empty character between `pos` and Line Feed character', () => {
        const source = '\nbad text ';

        const pos = 3;

        expect(checkStartOfLine(source, 0, pos)).toBe(false);
    });

    it('should node handle part of `source` that is less than `minPos` argument', () => {
        const source = 'start text';

        const minPos = 5;
        const pos = 5;

        expect(checkStartOfLine(source, minPos, pos)).toBe(true);
    });
});

describe('checkHasText', () => {
    it('should work only with part of `source` that is from start to end', () => {
        const source = 'a t';

        const start = 1;
        const end = 2;

        expect(checkHasText(source, start, end)).toBe(false);
    });

    it('should return `true` if `source` contains non empty characters', () => {
        const source = '   abc    \t';

        expect(checkHasText(source, 0, source.length)).toBe(true);
    });

    it('should return `false` if `source` contains only spaces or tabs', () => {
        const source = '\t\t\t\t\t\t\t\t\t\t        \t\t\t\t\t';

        expect(checkHasText(source, 0, source.length)).toBe;
    });
});
